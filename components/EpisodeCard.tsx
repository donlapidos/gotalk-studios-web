import Image from 'next/image'
import type { Episode } from '@/lib/episodes'
import { showByKey } from '@/lib/shows'

// ─── Dates ────────────────────────────────────────────────────────────────────

const DAY = 86_400_000

/** "Today", "3 days ago", "2 weeks ago", then a plain date. */
export function relativeDate(iso: string | null, now = Date.now()): string | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return null
  const days = Math.floor((now - t) / DAY)
  if (days < 1) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 28) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'Last week' : `${weeks} weeks ago`
  }
  return new Date(t).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kuching',
  })
}

/** Uploads younger than this get the "New" plate. */
export function isFresh(iso: string | null, now = Date.now()): boolean {
  if (!iso) return false
  const t = Date.parse(iso)
  return !Number.isNaN(t) && now - t < 21 * DAY
}

export function metaLine(ep: Episode, { withShow = false } = {}): string {
  return [
    withShow ? showByKey(ep.show)?.name : null,
    ep.episodeNumber ? `Ep ${ep.episodeNumber}` : null,
    relativeDate(ep.publishedAt),
  ]
    .filter(Boolean)
    .join(' · ')
}

// ─── Card ─────────────────────────────────────────────────────────────────────
//
// Thumbnail-led. The archive used to be cream name-plates with no image at all,
// on a video show, with the hook squeezed into 12px caps under the guest's name.
// Interview cards now lead with the conversation's hook; Voices cards lead with
// the person, because the person is the story.

type Props = {
  ep: Episode
  /** Show the show name in the meta line (mixed-show lists). */
  withShow?: boolean
  /** Tag the card as the newest upload. */
  isNew?: boolean
  priority?: boolean
}

export default function EpisodeCard({ ep, withShow = false, isNew = false, priority = false }: Props) {
  const isVoices = showByKey(ep.show)?.kind === 'stories'
  const meta = metaLine(ep, { withShow })

  const body = (
    <>
      <div className="relative aspect-video overflow-hidden bg-surface-raised">
        {ep.thumbnail && (
          <Image
            src={ep.thumbnail}
            alt=""
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {isNew && (
          <span className="absolute top-0 left-0 bg-brand-red text-white text-2xs font-bold tracking-label uppercase px-2.5 py-1.5">
            New
          </span>
        )}
      </div>

      <div className="pt-4 flex flex-col gap-2">
        {meta && (
          <p className="text-2xs text-white/55 uppercase tracking-label tabular-nums">{meta}</p>
        )}
        {isVoices ? (
          <>
            {ep.guest && (
              <h3 className="font-display text-3xl text-white leading-[0.95] tracking-wide group-hover:text-accent transition-colors">
                {ep.guest}
              </h3>
            )}
            <p className="text-base text-white/80 leading-snug line-clamp-2">
              &ldquo;{ep.title}&rdquo;
            </p>
          </>
        ) : (
          <>
            <h3 className="font-display text-2xl text-white leading-[1.02] tracking-wide line-clamp-3 group-hover:text-accent transition-colors">
              {ep.title}
            </h3>
            {/* Guest one step down the ladder from the title: lighter weight
                and lower contrast, so the hook reads first. */}
            {ep.guest && (
              <p className="text-sm text-white/60 leading-snug">
                {ep.guest}
                {ep.guestDetail && <span className="text-white/45"> · {ep.guestDetail}</span>}
              </p>
            )}
          </>
        )}
      </div>
    </>
  )

  if (!ep.url) return <div className="flex flex-col">{body}</div>

  return (
    <a
      href={ep.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col"
      aria-label={`${isVoices && ep.guest ? `${ep.guest}: ` : ''}${ep.title}${!isVoices && ep.guest ? ` with ${ep.guest}` : ''} (opens YouTube)`}
    >
      {body}
    </a>
  )
}
