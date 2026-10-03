import 'server-only'

import { sanityFetch } from '@/sanity/lib/live'
import { ALL_EPISODES_QUERY } from '@/sanity/lib/queries'
import { imageUrl, type SanityImageValue } from '@/sanity/lib/image'
import { extractYouTubeId } from '@/lib/youtube'
import { SHOWS, YOUTUBE_CHANNEL_ID, showBySegment, type ShowKey } from '@/lib/shows'

/**
 * Episodes, with YouTube as the source of truth.
 *
 * Publishing used to mean uploading to YouTube *and* hand-entering the episode
 * in Sanity; nothing reached the site until the second step happened. Now the
 * public YouTube feeds (channel + one per show playlist, no API key) are read
 * hourly, so an upload appears on its own. Sanity is enrichment: where an
 * episode document exists for the same video, its guest name, company, custom
 * thumbnail and description win.
 *
 * The feeds only carry each playlist's latest 15 videos, so the back catalogue
 * still comes from Sanity: anything in Sanity that the feeds no longer list is
 * kept as-is. Merging is by YouTube video id.
 */

export type Episode = {
  /** Stable key: the YouTube video id, or the Sanity id for an episode without a video. */
  id: string
  videoId: string | null
  show: ShowKey
  /** The episode's hook, e.g. "From Food Trucks to Multiple Outlets". */
  title: string
  guest: string | null
  guestDetail: string | null
  episodeNumber: number | null
  /** ISO date or datetime. */
  publishedAt: string | null
  thumbnail: string | null
  description: string | null
  url: string | null
}

// ─── YouTube feed ─────────────────────────────────────────────────────────────

type FeedEntry = {
  videoId: string
  title: string
  publishedAt: string
  description: string
  isShort: boolean
}

const FEED_REVALIDATE_SECONDS = 3600

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function pick(xml: string, re: RegExp): string {
  const m = xml.match(re)
  return m ? decodeEntities(m[1]).trim() : ''
}

async function fetchFeed(param: 'channel_id' | 'playlist_id', id: string): Promise<FeedEntry[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?${param}=${id}`, {
      next: { revalidate: FEED_REVALIDATE_SECONDS },
    })
    if (!res.ok) return []
    const xml = await res.text()
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .map(([, entry]) => ({
        videoId: pick(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/),
        title: pick(entry, /<title>([^<]*)<\/title>/),
        publishedAt: pick(entry, /<published>([^<]+)<\/published>/),
        description: pick(entry, /<media:description>([\s\S]*?)<\/media:description>/),
        isShort: /<link rel="alternate" href="[^"]*\/shorts\//.test(entry),
      }))
      .filter((e) => e.videoId)
  } catch {
    // A feed outage must not take the page down; the Sanity catalogue still renders.
    return []
  }
}

// ─── Title and description parsing ────────────────────────────────────────────

/** "Sarawak Icons", "Sarawak Politics", "Sarawak Local Entrepreneurs" as a title prefix. */
const SHOW_PREFIX = /^sarawak\s+(icons|politics|local\s+entrepreneurs?)$/i

/**
 * Voices has no public playlist yet. Until it does, an upload counts as Voices
 * when it is a full video (not a Short), sits in none of the show playlists, and
 * is titled "Story | Name" — the format the show uses ("Battling with Borderline
 * Personality | Farnis"). Event coverage and short films are titled without the
 * separator, so they stay out. Interview episodes not yet added to their
 * playlist are caught first by the show named in their description.
 */
/** "Sarawak Local Entrepreneurs – Episode 17" in a description names the show. */
const DESCRIPTION_SHOW: [RegExp, ShowKey][] = [
  [/sarawak\s+local\s+entrepreneurs?/i, 'business'],
  [/sarawak\s+politics/i, 'politics'],
  [/sarawak\s+icons/i, 'icons'],
]

function showFromDescription(description: string): ShowKey | null {
  const head = description.slice(0, 200)
  for (const [re, key] of DESCRIPTION_SHOW) if (re.test(head)) return key
  return null
}

function looksLikeVoices(entry: FeedEntry): boolean {
  if (entry.isShort) return false
  const parts = entry.title.split(' | ')
  return parts.length === 2 && parts[0].trim().length > 0 && parts[1].trim().length > 0
}

function stripMarkdown(s: string): string {
  return s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/(^|\s)\*(\S[^*]*?)\*(?=\s|$|[.,!?])/g, '$1$2')
}

/** First bold line in a description that isn't a restatement of the title. */
function boldLine(description: string, title: string): string | null {
  for (const m of description.matchAll(/\*\*(.+?)\*\*/g)) {
    const line = m[1].trim()
    if (line && !line.includes(' | ') && line.toLowerCase() !== title.toLowerCase()) return line
  }
  return null
}

/** Leading emoji and symbols, as in "🧠 Battling with Borderline Personality". */
function stripLeadingSymbols(s: string): string {
  return s.replace(/^[^\p{L}\p{N}"'“‘(]+/u, '').trim()
}

/** Split "Hook | GUEST" (or "Sarawak Politics | Hook | GUEST") into its parts. */
function parseTitle(rawTitle: string, description = ''): { title: string; guest: string | null } {
  const parts = stripLeadingSymbols(rawTitle)
    .replace(/^ep\s*\d+\s*[-–:]\s*/i, '') // "EP 3-What Does a Political Secretary Do?"
    .split(' | ')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length > 1 && SHOW_PREFIX.test(parts[0])) {
    parts.shift()
    if (parts.length === 1) {
      // "Sarawak Icons | Johan Ghazali (Jojo)" leaves only the guest; the hook is
      // the bold strapline the description opens with.
      const hook = boldLine(description, rawTitle)
      return hook ? { title: hook, guest: parts[0] } : { title: parts[0], guest: null }
    }
  }
  if (parts.length <= 1) return { title: parts[0] ?? rawTitle, guest: null }
  const guest = parts.pop() ?? null
  return { title: parts.join(' — '), guest }
}

/**
 * The paragraph of a YouTube description worth showing: skips the header block
 * that restates show, episode and guest, strips markdown, drops hashtags.
 */
export function summarise(description: string | null | undefined): string | null {
  if (!description) return null
  const paragraphs = stripMarkdown(description)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  const body = paragraphs.find(
    (p) =>
      p.length >= 60 &&
      !p.includes(' | ') &&
      !/\bepisode\s+\d+/i.test(p.slice(0, 80)) &&
      !p.startsWith('#'),
  )
  return body ?? null
}

function episodeNumberFrom(description: string): number | null {
  const m = description.match(/episode\s+(\d{1,3})\b/i)
  return m ? Number(m[1]) : null
}

function thumbFor(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

// ─── Merge ────────────────────────────────────────────────────────────────────

type SanityEpisode = {
  _id: string
  title: string | null
  episodeNumber: number | null
  segment: string | null
  guestName: string | null
  guestCompany: string | null
  youtubeUrl: string | null
  thumbnail: SanityImageValue | null
  description: string | null
  publishedAt: string | null
}

function byNewest(a: Episode, b: Episode): number {
  if (a.publishedAt && b.publishedAt) return b.publishedAt.localeCompare(a.publishedAt)
  if (a.publishedAt) return -1
  if (b.publishedAt) return 1
  return (b.episodeNumber ?? 0) - (a.episodeNumber ?? 0)
}

export async function getEpisodes(): Promise<Episode[]> {
  const showsWithPlaylists = SHOWS.filter((s) => s.playlistId)

  const [channel, playlistFeeds, { data: sanityData }] = await Promise.all([
    fetchFeed('channel_id', YOUTUBE_CHANNEL_ID),
    Promise.all(showsWithPlaylists.map((s) => fetchFeed('playlist_id', s.playlistId!))),
    sanityFetch({ query: ALL_EPISODES_QUERY }),
  ])

  const sanityEpisodes = (sanityData ?? []) as SanityEpisode[]
  const sanityByVideo = new Map<string, SanityEpisode>()
  for (const doc of sanityEpisodes) {
    const id = extractYouTubeId(doc.youtubeUrl)
    if (id) sanityByVideo.set(id, doc)
  }

  // Which show each video belongs to. Playlist membership is authoritative.
  const showOfVideo = new Map<string, ShowKey>()
  const entries = new Map<string, FeedEntry>()
  playlistFeeds.forEach((feed, i) => {
    for (const entry of feed) {
      showOfVideo.set(entry.videoId, showsWithPlaylists[i].key)
      entries.set(entry.videoId, entry)
    }
  })
  // Uploads in no show playlist (often just not added to it yet). Precedence:
  //   1. the description's own header ("Sarawak Local Entrepreneurs – Episode 17")
  //   2. a Sanity tag for a show without a playlist (Voices)
  //   3. the Voices title rule
  //   4. any other Sanity tag
  // The rule beats a playlist-show tag because the first Voices episode was
  // entered as Icons, before Voices existed as an option.
  for (const entry of channel) {
    if (entries.has(entry.videoId)) continue
    const tagged = showBySegment(sanityByVideo.get(entry.videoId)?.segment)
    const described = entry.isShort ? null : showFromDescription(entry.description)
    if (described) showOfVideo.set(entry.videoId, described)
    else if (tagged && !tagged.playlistId) showOfVideo.set(entry.videoId, tagged.key)
    else if (looksLikeVoices(entry)) showOfVideo.set(entry.videoId, 'voices')
    else if (tagged) showOfVideo.set(entry.videoId, tagged.key)
    else continue // event coverage, short films, Shorts: not show episodes
    entries.set(entry.videoId, entry)
  }

  const episodes: Episode[] = []

  for (const [videoId, entry] of entries) {
    const show = showOfVideo.get(videoId)
    if (!show) continue
    const doc = sanityByVideo.get(videoId)
    const parsed = parseTitle(entry.title, entry.description)
    episodes.push({
      id: videoId,
      videoId,
      show,
      title: (doc?.title && parseTitle(doc.title, doc.description ?? entry.description).title) || parsed.title,
      guest: doc?.guestName?.trim() || parsed.guest,
      guestDetail: doc?.guestCompany?.trim() || null,
      // YouTube is the record: the description's "Episode 17" beats a hand-typed number.
      episodeNumber: episodeNumberFrom(entry.description) ?? doc?.episodeNumber ?? null,
      publishedAt: entry.publishedAt || doc?.publishedAt || null,
      thumbnail: imageUrl(doc?.thumbnail, 960, 540) ?? thumbFor(videoId),
      description: summarise(doc?.description) ?? summarise(entry.description),
      url: `https://www.youtube.com/watch?v=${videoId}`,
    })
  }

  // The back catalogue: Sanity episodes the feeds no longer carry.
  for (const doc of sanityEpisodes) {
    const videoId = extractYouTubeId(doc.youtubeUrl) || null
    if (videoId && entries.has(videoId)) continue
    const show = showBySegment(doc.segment)
    if (!show) continue
    episodes.push({
      id: videoId ?? doc._id,
      videoId,
      show: show.key,
      title: (doc.title && parseTitle(doc.title, doc.description ?? '').title) || 'Untitled episode',
      guest: doc.guestName?.trim() || null,
      guestDetail: doc.guestCompany?.trim() || null,
      episodeNumber: doc.episodeNumber ?? null,
      publishedAt: doc.publishedAt ?? null,
      thumbnail: imageUrl(doc.thumbnail, 960, 540) ?? (videoId ? thumbFor(videoId) : null),
      description: summarise(doc.description),
      url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
    })
  }

  return episodes.sort(byNewest)
}

export function countGuests(episodes: Episode[]): number {
  return new Set(episodes.map((e) => e.guest?.toLowerCase()).filter(Boolean)).size
}
