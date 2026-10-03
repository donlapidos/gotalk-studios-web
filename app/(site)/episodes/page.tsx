import type { Metadata } from "next";
import Link from "next/link";
import ShowShelf from "@/components/ShowShelf";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { metaLine } from "@/components/EpisodeCard";
import { getEpisodes, type Episode } from "@/lib/episodes";
import { SHOWS, playlistUrl, showByKey } from "@/lib/shows";
import { FadeIn, FadeUp } from "@/components/motion";

export const metadata: Metadata = {
  title:       "The Conversations",
  description: "Every GoTalk Studios episode — Sarawak's entrepreneurs, leaders and icons, and the everyday people telling their own stories on GoTalk Voices.",
  openGraph: {
    title:       "The Conversations",
    description: "Every GoTalk Studios episode — Sarawak's entrepreneurs, leaders and icons, and the everyday people telling their own stories on GoTalk Voices.",
    url:         "https://gotalkstudios.com/episodes",
    type:        "website",
  },
  twitter: {
    title:       "The Conversations",
    description: "Every GoTalk Studios episode — Sarawak's entrepreneurs, leaders and icons, and the everyday people telling their own stories on GoTalk Voices.",
  },
};

// ─── Latest ───────────────────────────────────────────────────────────────────
//
// Was a text column capped at 55% width with nothing on the right, on the one
// page whose job is video, and it led with whichever episode carried a manual
// "featured" flag. It now leads with the newest upload, with the player in the
// empty half.

function Latest({ episode }: { episode: Episode }) {
  const show = showByKey(episode.show)
  const isVoices = show?.kind === "stories"

  return (
    <section aria-label="Latest episode" className="bg-surface-sunken border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-5 lg:order-2">
          <FadeIn delay={0.1}>
            <p className="text-2xs font-bold tracking-label uppercase text-accent mb-4">
              Latest · {metaLine(episode, { withShow: true })}
            </p>
          </FadeIn>
          <FadeUp delay={0.2}>
            <p
              className="font-display text-white uppercase leading-[0.95] tracking-wide mb-4 text-balance"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
            >
              {isVoices && episode.guest ? episode.guest : episode.title}
            </p>
          </FadeUp>
          <FadeUp delay={0.28}>
            <p className="text-sm text-white/60 mb-5">
              {isVoices
                ? <>&ldquo;{episode.title}&rdquo;</>
                : [episode.guest, episode.guestDetail].filter(Boolean).join(" · ")}
            </p>
          </FadeUp>
          {episode.description && (
            <FadeUp delay={0.34}>
              <p className="text-white/70 leading-relaxed text-base mb-8 max-w-[60ch] line-clamp-4">
                {episode.description}
              </p>
            </FadeUp>
          )}
          {episode.url && (
            <FadeUp delay={0.4}>
              <a
                href={episode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 min-h-[48px] bg-brand-red text-white text-2xs font-bold tracking-label uppercase px-6 hover:bg-brand-red-hover active:scale-95 transition-all"
              >
                Watch on YouTube
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="square" />
                </svg>
              </a>
            </FadeUp>
          )}
        </div>

        <div className="lg:col-span-7 lg:order-1">
          <FadeIn>
            <YouTubeEmbed
              videoId={episode.videoId ?? ""}
              title={episode.title}
              thumbnail={episode.videoId ? undefined : episode.thumbnail ?? undefined}
              badge={show?.name}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const episodes = await getEpisodes();

  // The home page's show cards link here with ?category=…
  const { category } = await searchParams;
  const active = showByKey(category?.toLowerCase()) ?? null;
  const latest = episodes[0] ?? null;

  const tabClass = (isActive: boolean) =>
    `inline-flex items-center gap-2 min-h-[44px] px-4 text-2xs font-bold tracking-label uppercase border transition-colors ${
      isActive
        ? "bg-brand-red border-brand-red text-white"
        : "border-white/15 text-white/70 hover:text-white hover:border-white/40"
    }`;

  return (
    <main id="main" tabIndex={-1} className="pt-16 bg-surface-base min-h-screen">

      {latest && !active && <Latest episode={latest} />}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 section-y-tight">

        <FadeUp>
          <h1 className="font-display text-white uppercase text-4xl lg:text-5xl tracking-wide mb-3">
            {active ? <>GoTalk <span className="text-brand-red">{active.name}</span></> : "The Conversations"}
          </h1>
          <p className="text-white/70 text-base max-w-[62ch] mb-10">
            {active ? (
              <>
                {active.premise}{" "}
                <a
                  href={playlistUrl(active)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline underline-offset-4 decoration-brand-red hover:text-accent transition-colors"
                >
                  {active.playlistId ? "Playlist on YouTube" : "Channel on YouTube"}
                </a>
              </>
            ) : (
              `Every GoTalk episode, across all ${SHOWS.length} shows — newest first.`
            )}
          </p>
        </FadeUp>

        <FadeIn>
          <nav aria-label="Shows" className="flex flex-wrap items-center gap-2 mb-14">
            <Link href="/episodes" aria-current={!active ? "page" : undefined} className={tabClass(!active)}>
              All
              <span className={!active ? "text-white" : "text-white/55"}>{episodes.length}</span>
            </Link>
            {SHOWS.map((s) => {
              const isActive = active?.key === s.key;
              const count = episodes.filter((ep) => ep.show === s.key).length;
              return (
                <Link
                  key={s.key}
                  href={`/episodes?category=${s.key}`}
                  aria-current={isActive ? "page" : undefined}
                  className={tabClass(isActive)}
                >
                  {s.name}
                  {/* full white on the red fill: white/80 there is 4.03:1 */}
                  <span className={isActive ? "text-white" : "text-white/55"}>{count}</span>
                </Link>
              );
            })}
          </nav>
        </FadeIn>

        {active ? (
          <ShowShelf
            show={active}
            episodes={episodes.filter((ep) => ep.show === active.key)}
            standalone
          />
        ) : (
          SHOWS.map((s) => (
            <ShowShelf
              key={s.key}
              show={s}
              episodes={episodes.filter((ep) => ep.show === s.key)}
              limit={6}
            />
          ))
        )}
      </div>

    </main>
  )
}
