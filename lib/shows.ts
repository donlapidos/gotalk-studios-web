/**
 * The shows, in one place.
 *
 * The show list used to be hard-coded in six files as Business / Politics / Icons,
 * with "three" written into the copy. Adding a show is now one entry here (plus
 * the Sanity option list, so editors can tag enrichment data).
 *
 * `playlistId` is the YouTube playlist the show publishes into; its public feed
 * is what makes new episodes appear on the site without anyone touching Sanity.
 * Voices has no public playlist yet, so its episodes are recognised by a title
 * rule in lib/episodes.ts. Once a public Voices playlist exists, put its id here
 * and the rule stops mattering.
 */

export type ShowKey = 'business' | 'politics' | 'icons' | 'voices'

export type Show = {
  key: ShowKey
  /** Short name, used in tabs and chips. */
  name: string
  /** The value stored in Sanity's `segment` field. */
  segment: string
  /** One line saying what the show is. */
  premise: string
  /** Interview shows lead with the conversation; Voices leads with the person. */
  kind: 'interview' | 'stories'
  playlistId?: string
  /** General studio art for the show card (not an episode thumbnail). */
  art?: string
}

export const SHOWS: readonly Show[] = [
  {
    key: 'business',
    art: '/segment-business.png',
    name: 'Business',
    segment: 'Business',
    premise: "The entrepreneurs, founders, and risk-takers building Sarawak's future.",
    kind: 'interview',
    playlistId: 'PLsaODil0l-EnRb_jjPX2ncVMUtP4C4yg8',
  },
  {
    key: 'politics',
    art: '/segment-politics.png',
    name: 'Politics',
    segment: 'Politics',
    premise: 'The decision-makers and public servants, in their own words.',
    kind: 'interview',
    playlistId: 'PLsaODil0l-EkmnA_tHTOfvef2FTXindF8',
  },
  {
    key: 'icons',
    art: '/segment-icons.png',
    name: 'Icons',
    segment: 'Icons',
    premise: "Sarawak's celebrated voices — artists, athletes, and cultural figures.",
    kind: 'interview',
    playlistId: 'PLsaODil0l-EljLVkZHSJpqtBQmSQEJozb',
  },
  {
    key: 'voices',
    name: 'Voices',
    segment: 'Voices',
    premise: 'Ordinary Sarawakians telling their own stories — whatever the story is.',
    kind: 'stories',
    // No render yet: the card draws matching studio art. Add '/segment-voices.png'
    // here once there is one.
  },
]

export const YOUTUBE_CHANNEL_ID = 'UCiIXarZSGsZ6vxXF9FSg_Sg'
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@gotalkstudios'

export function showByKey(key: string | undefined | null): Show | undefined {
  return SHOWS.find((s) => s.key === key)
}

export function showBySegment(segment: string | undefined | null): Show | undefined {
  if (!segment) return undefined
  return SHOWS.find((s) => s.segment.toLowerCase() === segment.toLowerCase())
}

export function playlistUrl(show: Show): string {
  return show.playlistId
    ? `https://www.youtube.com/playlist?list=${show.playlistId}`
    : YOUTUBE_CHANNEL_URL
}
