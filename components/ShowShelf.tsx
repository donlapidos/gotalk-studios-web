import Link from 'next/link'
import EpisodeCard from '@/components/EpisodeCard'
import { FadeUp, StaggerList, StaggerItem } from '@/components/motion'
import { playlistUrl, type Show } from '@/lib/shows'
import type { Episode } from '@/lib/episodes'

type Props = {
  show: Show
  episodes: Episode[]
  /** Cap the shelf (the all-shows view) and link through to the full list. */
  limit?: number
  /** The filtered view: the page already carries the show's name as its h1. */
  standalone?: boolean
}

export default function ShowShelf({ show, episodes, limit, standalone = false }: Props) {
  const shown = limit ? episodes.slice(0, limit) : episodes
  const hidden = episodes.length - shown.length

  return (
    <section className="mb-20 scroll-mt-24" id={show.key} aria-labelledby={standalone ? undefined : `${show.key}-heading`}>
      {!standalone && (
        <FadeUp>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 mb-7 pb-4 border-b border-white/10">
            <div>
              <h2
                id={`${show.key}-heading`}
                className="font-display text-4xl text-white tracking-wide leading-none"
              >
                GoTalk <span className="text-brand-red">{show.name}</span>
              </h2>
              <p className="text-white/70 text-sm mt-2 max-w-[62ch]">{show.premise}</p>
            </div>
            {hidden > 0 ? (
              <Link
                href={`/episodes?category=${show.key}`}
                className="inline-flex items-center min-h-[44px] text-2xs font-bold tracking-label uppercase text-white border-b-2 border-brand-red hover:text-accent transition-colors"
              >
                All {episodes.length} {show.kind === 'stories' ? 'stories' : 'episodes'}
              </Link>
            ) : null}
          </div>
        </FadeUp>
      )}

      {shown.length === 0 ? (
        <div className="border border-white/10 bg-surface-raised px-6 py-14 text-center">
          <p className="font-display text-2xl text-white tracking-wide mb-2">Coming soon</p>
          <p className="text-sm text-white/70">
            No {show.name} {show.kind === 'stories' ? 'stories' : 'episodes'} published yet.{' '}
            <a
              href={playlistUrl(show)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-brand-red hover:text-white"
            >
              Follow the channel on YouTube
            </a>{' '}
            to catch the first one.
          </p>
        </div>
      ) : (
        <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {shown.map((ep) => (
            <StaggerItem key={ep.id}>
              <EpisodeCard ep={ep} />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </section>
  )
}
