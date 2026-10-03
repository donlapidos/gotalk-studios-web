import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { sanityFetch } from "@/sanity/lib/live";
import { GUEST_COUNT_QUERY } from "@/sanity/lib/queries";
import { getEpisodes, countGuests, type Episode } from "@/lib/episodes";
import { SHOWS, showByKey, type Show } from "@/lib/shows";
import { isFresh, metaLine } from "@/components/EpisodeCard";

export const metadata: Metadata = {
  title: { absolute: "GoTalk Studios | Real People. Real Stories. Real Sarawak." },
  description: "GoTalk Studios is Sarawak's home for honest conversations with entrepreneurs, leaders, and icons. Watch on YouTube.",
  openGraph: {
    title:       "GoTalk Studios | Real People. Real Stories. Real Sarawak.",
    description: "GoTalk Studios is Sarawak's home for honest conversations with entrepreneurs, leaders, and icons. Watch on YouTube.",
    url:         "https://gotalkstudios.com",
    type:        "website",
  },
  twitter: {
    title:       "GoTalk Studios | Real People. Real Stories. Real Sarawak.",
    description: "GoTalk Studios is Sarawak's home for honest conversations with entrepreneurs, leaders, and icons. Watch on YouTube.",
  },
};
import {
  FadeUp,
  FadeIn,
  LineReveal,
  LineRevealScroll,
  StaggerList,
  StaggerItem,
  ScaleIn,
  ClipReveal,
  BlurUp,
} from "@/components/motion";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end bg-surface-base overflow-hidden noise">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 bg-surface-sunken" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-surface-base/70 via-surface-base/40 to-surface-base" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,#CC000018_0%,transparent_70%)]" />

      {/* Left red accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red z-10" />

      {/* Grid */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-24 pt-40">
        {/* The eyebrow that used to sit here ("Sarawak's Premier Talk Show
            Studio") is gone: the headline carries its own weight, and at 0.3em
            tracking the label wrapped mid-phrase on mobile and read as broken. */}

        {/* Main headline — line-by-line reveal. This is an <h1> now; the page's
            front door previously opened on an <h2>, with no h1 anywhere. */}
        <h1 className="font-display text-[clamp(4rem,12vw,9rem)] leading-[0.93] tracking-wide text-white mb-8">
          <LineReveal delay={0.15}>Real People.</LineReveal>
          <LineReveal delay={0.3}>
            Real <span className="text-brand-red">Stories.</span>
          </LineReveal>
          <LineReveal delay={0.45}>Real Sarawak.</LineReveal>
        </h1>

        {/* Subheadline */}
        <FadeIn delay={0.65}>
          <p className="max-w-[62ch] text-lg text-white/70 leading-relaxed mb-10">
            GoTalk Studios is Sarawak&apos;s home for honest conversations —
            with the entrepreneurs building tomorrow, the leaders shaping today,
            the icons defining our culture, and the everyday Sarawakians whose
            stories deserve a hearing.
          </p>
        </FadeIn>

        {/* CTAs — equal width when stacked, so the vertical stack doesn't rag. */}
        <FadeUp delay={0.8}>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none">
            <Link
              href="#latest"
              className="group inline-flex items-center justify-center gap-3 bg-brand-red text-white text-sm font-bold tracking-wide uppercase px-7 py-4 min-h-[52px] hover:bg-brand-red-hover active:scale-95 transition-all"
            >
              Watch Latest Episode
              <Arrow />
            </Link>
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center gap-2 border border-white/25 text-white text-sm font-semibold tracking-wide uppercase px-7 py-4 min-h-[52px] hover:border-white hover:bg-white/5 active:scale-95 transition-all"
            >
              Book the Studio
            </Link>
          </div>
        </FadeUp>
      </div>

    </section>
  );
}

// ─── On the Record ─────────────────────────────────────────────────────────────
//
// Replaces two sections. The red figures band ("27 Episodes / 25 Guests / 3 Show
// Segments") put three cold counts straight after a promise about people, and it
// only moved when someone hand-entered an episode in Sanity. The "Latest Episode"
// block below it depended on a manual "featured" flag. Both now come from the
// YouTube feeds: upload an episode and it leads this section within the hour.
// The counts survive as one caption line, where they inform instead of perform.

function RecordRow({ ep }: { ep: Episode }) {
  const isVoices = showByKey(ep.show)?.kind === "stories";
  const inner = (
    <>
      <div className="relative aspect-video overflow-hidden bg-surface-raised">
        {ep.thumbnail && (
          <Image
            src={ep.thumbnail}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 40vw, 12rem"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-2xs text-white/55 uppercase tracking-label mb-1.5 tabular-nums">
          {metaLine(ep, { withShow: true })}
        </p>
        <p className="font-display text-xl sm:text-2xl text-white leading-[1.02] tracking-wide line-clamp-2 group-hover:text-accent transition-colors">
          {isVoices && ep.guest ? ep.guest : ep.title}
        </p>
        <p className="text-xs text-white/70 mt-1 line-clamp-1">
          {isVoices ? <>&ldquo;{ep.title}&rdquo;</> : ep.guest}
        </p>
      </div>
    </>
  );
  const cls = "group grid grid-cols-[minmax(0,8.5rem)_1fr] sm:grid-cols-[minmax(0,12rem)_1fr] gap-4 items-start py-5";
  return ep.url ? (
    <a href={ep.url} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function OnTheRecord({
  episodes,
  guestCount,
}: {
  episodes: Episode[];
  guestCount: number;
}) {
  const [lead, ...rest] = episodes;
  if (!lead) return null;

  const show = showByKey(lead.show);
  const isVoices = show?.kind === "stories";
  const fresh = isFresh(lead.publishedAt);
  const facts = [
    `${episodes.length} episodes`,
    guestCount > 0 ? `${guestCount} guests` : null,
    `${SHOWS.length} shows`,
  ].filter(Boolean).join(" · ");

  return (
    <section id="latest" className="section-y-tight bg-surface-alt scroll-mt-16" aria-labelledby="latest-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-10 lg:mb-12">
          <BlurUp>
            <h2 id="latest-heading" className="font-display text-white text-5xl lg:text-6xl tracking-wide leading-[0.9]">
              On the <span className="text-brand-red">Record</span>
            </h2>
          </BlurUp>
          <FadeIn delay={0.15}>
            <p className="text-sm text-white/70 tabular-nums">
              {facts} ·{" "}
              <Link
                href="/episodes"
                className="text-white font-semibold underline underline-offset-4 decoration-brand-red decoration-2 hover:text-accent transition-colors"
              >
                See them all
              </Link>
            </p>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Lead: the newest upload, playable in place */}
          <div className="lg:col-span-7">
            <ScaleIn>
              <YouTubeEmbed
                videoId={lead.videoId ?? ""}
                title={lead.title}
                thumbnail={lead.videoId ? undefined : lead.thumbnail ?? undefined}
                badge={fresh ? "New" : show?.name}
              />
            </ScaleIn>
            <FadeUp delay={0.1}>
              <p className="text-2xs font-bold tracking-label uppercase text-accent mt-6 mb-3 tabular-nums">
                {metaLine(lead, { withShow: true })}
              </p>
              <h3 className="font-display text-4xl lg:text-5xl text-white leading-[0.95] tracking-wide mb-3 text-balance">
                {isVoices && lead.guest ? lead.guest : lead.title}
              </h3>
              <p className="text-sm text-white/60 mb-4">
                {isVoices
                  ? <>&ldquo;{lead.title}&rdquo;</>
                  : [lead.guest, lead.guestDetail].filter(Boolean).join(" · ")}
              </p>
              {lead.description && (
                <p className="text-white/70 leading-relaxed text-base max-w-[64ch] line-clamp-3">
                  {lead.description}
                </p>
              )}
            </FadeUp>
          </div>

          {/* The next four, newest first */}
          {rest.length > 0 && (
            <div className="lg:col-span-5">
              <p className="text-2xs font-bold tracking-label uppercase text-white/55 pb-3 border-b border-white/10">
                Also new
              </p>
              <StaggerList className="divide-y divide-white/10">
                {rest.slice(0, 4).map((ep) => (
                  <StaggerItem key={ep.id}>
                    <RecordRow ep={ep} />
                  </StaggerItem>
                ))}
              </StaggerList>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── The Shows ────────────────────────────────────────────────────────────────
//
// Four identical dark cards, one per show, each with its general studio art (not
// a specific episode). The earlier version stacked cream plates, red seams and
// solid red action bars, which put white, red and black at full strength in the
// same square inch; red is now spent only on the hover state.

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="square" />
    </svg>
  );
}

/** Stand-in art for a show without a render yet: the same black set, neon rules and spotlight. */
function StudioArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#050505] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 22% 75% at 50% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 55%, transparent 80%)," +
            "radial-gradient(ellipse 30% 9% at 50% 82%, rgba(255,255,255,0.22) 0%, transparent 100%)," +
            "radial-gradient(ellipse 90% 30% at 50% 110%, rgba(204,0,0,0.35) 0%, transparent 70%)",
        }}
      />
      {[
        ["0%", "28%", "24%"], ["0%", "36%", "38%"], ["0%", "46%", "30%"],
        ["66%", "31%", "34%"], ["74%", "41%", "26%"], ["70%", "51%", "30%"],
      ].map(([left, top, width]) => (
        <span
          key={left + top}
          className="absolute h-[2px] bg-[#ff5a5a] shadow-[0_0_8px_rgba(255,60,60,0.8)]"
          style={{ left, top, width }}
        />
      ))}
    </div>
  );
}

function ShowCard({ show, count }: { show: Show; count: number }) {
  const label =
    count > 0
      ? `${count} ${show.kind === "stories" ? (count === 1 ? "story" : "stories") : count === 1 ? "episode" : "episodes"}`
      : "Coming soon";
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden">
        {show.art ? (
          <Image
            src={show.art}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <StudioArt />
        )}
      </div>
      <div className="flex-1 flex flex-col px-5 pt-5 pb-5">
        <h3 className="font-display text-3xl text-white tracking-wide leading-none mb-2 transition-colors group-hover:text-accent">
          {show.name}
        </h3>
        <p className="text-sm text-white/60 leading-relaxed mb-6">{show.premise}</p>
        <span className="mt-auto flex items-center justify-between pt-4 border-t border-white/10 text-2xs font-bold tracking-label uppercase text-white/70 group-hover:text-white transition-colors tabular-nums">
          {label}
          {count > 0 && <Arrow />}
        </span>
      </div>
    </>
  );
  const cls = "group flex flex-col h-full bg-surface-raised border border-white/10 hover:border-white/25 transition-colors overflow-hidden";
  return count > 0 ? (
    <Link href={`/episodes?category=${show.key}`} className={cls}>{inner}</Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function TheShows({ episodes }: { episodes: Episode[] }) {
  return (
    <section className="section-y bg-surface-base" aria-labelledby="shows-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <BlurUp>
          <h2 id="shows-heading" className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-[0.9] mb-12">
            The <span className="text-brand-red">Shows</span>
          </h2>
        </BlurUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHOWS.map((show, i) => (
            <ClipReveal key={show.key} delay={i * 0.1} className="h-full">
              <ShowCard show={show} count={episodes.filter((ep) => ep.show === show.key).length} />
            </ClipReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────

function FooterCTA() {
  return (
    <section className="relative section-y bg-surface-base overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />

      {/* Wordmark watermark, restored — but anchored to the bottom edge and bled
          off it rather than centred behind the headline, which is what made it
          muddy the type. Red at 0.07 instead of white: it warms the whole panel
          rather than greying it. */}
      <div
        className="absolute inset-x-0 bottom-0 flex justify-center overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-display whitespace-nowrap leading-[0.75] tracking-widest text-brand-red/[0.07]"
          style={{ fontSize: "24vw", transform: "translateY(34%)" }}
        >
          GOTALK
        </span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <LineRevealScroll>
          <h2 className="font-display text-5xl lg:text-6xl text-white leading-tight tracking-wide mb-6">
            Your Story Belongs on{" "}
            <span className="text-brand-red">GoTalk.</span>
          </h2>
        </LineRevealScroll>

        <FadeUp delay={0.2}>
          <p className="text-white/70 text-lg max-w-[55ch] mx-auto mb-10 leading-relaxed">
            Whether you&apos;re a founder, a leader, or a Sarawakian with a
            story worth hearing — the GoTalk chair is waiting.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-3 bg-brand-red text-white text-sm font-bold tracking-label uppercase px-10 py-5 min-h-[52px] hover:bg-brand-red-hover active:scale-95 transition-all"
          >
            Pitch Yourself as a Guest
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [episodes, { data: sanityGuests }] = await Promise.all([
    getEpisodes(),
    sanityFetch({ query: GUEST_COUNT_QUERY }),
  ]);
  // Guests with a profile in Sanity, or named in an episode the feed brought in,
  // whichever is higher: new uploads count before anyone writes a profile.
  const guestCount = Math.max(sanityGuests ?? 0, countGuests(episodes));

  return (
    <>
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <OnTheRecord episodes={episodes} guestCount={guestCount} />
        <TheShows episodes={episodes} />
        <FooterCTA />
      </main>
    </>
  );
}
