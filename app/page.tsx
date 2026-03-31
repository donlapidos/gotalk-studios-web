import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { videoIds } from "@/lib/episodes";
import {
  FadeUp,
  FadeIn,
  LineReveal,
  LineRevealScroll,
  StaggerList,
  StaggerItem,
  ScaleIn,
  DrawLine,
} from "@/components/motion";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end bg-[#111111] overflow-hidden noise">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/gotalkstudio/1920/1080"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#111111]/70 via-[#111111]/40 to-[#111111]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,#CC000018_0%,transparent_70%)]" />

      {/* Left red accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC0000] z-10" />

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
        {/* Pre-headline */}
        <FadeIn delay={0.2}>
          <div className="flex items-center gap-3 mb-6">
            <DrawLine delay={0.3} className="w-8 h-px bg-[#CC0000]" />
            <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
              Sarawak&apos;s Premier Talk Show Studio
            </span>
          </div>
        </FadeIn>

        {/* Main headline — line-by-line reveal */}
        <div className="font-[family-name:var(--font-bebas-neue)] text-[clamp(4rem,12vw,10rem)] leading-[0.93] tracking-wide text-white mb-8">
          <LineReveal delay={0.35}>Real People.</LineReveal>
          <LineReveal delay={0.5}>
            Real <span className="text-[#CC0000]">Stories.</span>
          </LineReveal>
          <LineReveal delay={0.65}>Real Sarawak.</LineReveal>
        </div>

        {/* Subheadline */}
        <FadeIn delay={0.85}>
          <p className="max-w-xl text-base text-white/70 leading-relaxed mb-10">
            GoTalk Studios is Sarawak&apos;s home for honest conversations —
            with the entrepreneurs building tomorrow, the leaders shaping today,
            and the icons defining our culture.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeUp delay={1.0}>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/episodes"
              className="group inline-flex items-center gap-3 bg-[#CC0000] text-white text-sm font-bold tracking-[0.15em] uppercase px-7 py-4 hover:bg-[#AA0000] active:scale-95 transition-all"
            >
              WATCH LATEST EPISODE
              <span className="group-hover:translate-x-1 transition-transform inline-block">
                →
              </span>
            </Link>
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 border border-white/25 text-white text-sm font-semibold tracking-[0.15em] uppercase px-7 py-4 hover:border-white hover:bg-white/5 active:scale-95 transition-all"
            >
              EXPLORE ALL SHOWS
            </Link>
          </div>
        </FadeUp>
      </div>

    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  return (
    <div className="border-t border-b border-white/10 bg-[#161616]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <StaggerList className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {[
            { value: "20+", label: "Episodes Recorded" },
            { value: "Kuching", label: "Broadcast from Sarawak" },
            { value: "3", label: "Show Segments" },
            { value: "Unscripted", label: "Always" },
          ].map((stat) => (
            <StaggerItem key={stat.label} className="flex-1">
              <div className="flex flex-col items-center justify-center py-7 px-4 text-center h-full">
                <span className="font-[family-name:var(--font-bebas-neue)] text-3xl lg:text-4xl text-[#CC0000] tracking-wider">
                  {stat.value}
                </span>
                <span className="text-[10px] text-white/35 uppercase tracking-[0.25em] mt-1">
                  {stat.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </div>
  );
}

// ─── Featured Episode ─────────────────────────────────────────────────────────

function FeaturedEpisode() {
  return (
    <section className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeUp>
          <div className="flex items-center gap-3 mb-14">
            <DrawLine className="w-8 h-px bg-[#CC0000]" />
            <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
              Latest Episode
            </span>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Thumbnail */}
          <ScaleIn>
            <YouTubeEmbed
              videoId={videoIds.ep11}
              title="What Would You Do If You Couldn't Say No to a Job?"
              badge="EP 11"
              duration="45:32"
            />
          </ScaleIn>

          {/* Info */}
          <div>
            <FadeUp delay={0.1}>
              <p className="text-[10px] text-white/35 uppercase tracking-[0.3em] mb-2">
                GoTalk Business
              </p>
            </FadeUp>
            <LineRevealScroll delay={0.15}>
              <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl lg:text-[3.25rem] text-white leading-tight mb-4 tracking-wide">
                What Would You Do If You Couldn&apos;t Say No to a Job?
              </h2>
            </LineRevealScroll>
            <FadeUp delay={0.2}>
              <p className="text-sm text-[#CC0000] font-semibold mb-5 uppercase tracking-widest">
                Jasveena — Jasveena Cleaning Service
              </p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="text-white/65 leading-relaxed mb-8 text-sm">
                Jasveena built her cleaning business from scratch while juggling
                a full-time job she couldn&apos;t afford to quit. In this
                episode, she opens up about the sacrifices, the near-burnouts,
                and the moment she finally bet on herself.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <Link
                href="/episodes/ep11"
                className="group inline-flex items-center gap-3 text-white font-bold tracking-[0.15em] uppercase text-sm border-b-2 border-[#CC0000] pb-1 hover:text-[#CC0000] transition-colors"
              >
                WATCH NOW
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Show Segments ────────────────────────────────────────────────────────────

function ShowSegments() {
  const segments = [
    {
      number: "01",
      name: "GOTALK BUSINESS",
      tagline:
        "The entrepreneurs, founders, and risk-takers building Sarawak's future.",
      href: "/episodes?category=business",
      comingSoon: false,
      img: "/segment-business.png",
    },
    {
      number: "02",
      name: "GOTALK POLITICS",
      tagline:
        "The decision-makers and public servants, in their own words.",
      href: "/episodes?category=politics",
      comingSoon: false,
      img: "/segment-politics.png",
    },
    {
      number: "03",
      name: "GOTALK ICONS",
      tagline:
        "Sarawak's celebrated voices — artists, athletes, and cultural figures.",
      href: "/episodes?category=icons",
      comingSoon: true,
      img: "/segment-icons.png",
    },
  ];

  return (
    <section className="py-24 bg-[#161616]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeUp>
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <DrawLine className="w-8 h-px bg-[#CC0000]" />
              <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                Our Shows
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-5xl lg:text-7xl text-white tracking-wide">
              The Conversations
            </h2>
          </div>
        </FadeUp>

        <StaggerList className="grid md:grid-cols-3 gap-4">
          {segments.map((seg) => (
            <StaggerItem key={seg.name}>
              <div className="group relative overflow-hidden bg-[#111111] hover:bg-[#181818] transition-colors border border-white/8 hover:border-[#CC0000]/30 h-full">
                {/* Background image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={seg.img}
                    alt={seg.name}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111]/40" />
                  {/* Number watermark */}
                  <span className="absolute top-4 right-4 font-[family-name:var(--font-bebas-neue)] text-6xl text-white/10 leading-none select-none">
                    {seg.number}
                  </span>
                </div>

                <div className="p-7">
                  {seg.comingSoon ? (
                    <span className="inline-block text-[10px] font-bold tracking-widest uppercase border border-white/15 text-white/30 px-2.5 py-1 mb-4">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="inline-block w-2.5 h-2.5 bg-[#CC0000] mb-4" />
                  )}

                  <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-widest mb-3 leading-tight">
                    {seg.name}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-6">
                    {seg.tagline}
                  </p>

                  {!seg.comingSoon ? (
                    <Link
                      href={seg.href}
                      className="text-xs font-bold tracking-[0.2em] uppercase text-[#CC0000] hover:text-white transition-colors group-hover:underline"
                    >
                      VIEW EPISODES →
                    </Link>
                  ) : (
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/15">
                      WATCH THIS SPACE
                    </span>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────

function FooterCTA() {
  return (
    <section className="relative py-28 lg:py-36 bg-[#111111] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC0000]" />

      {/* Background image with heavy overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/seed/gotalkchair/1440/600"
          alt=""
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#111111]/90" />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span className="font-[family-name:var(--font-bebas-neue)] text-[22vw] text-white/[0.025] whitespace-nowrap leading-none tracking-widest">
          GOTALK
        </span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <FadeUp>
          <div className="flex items-center justify-center gap-3 mb-6">
            <DrawLine className="w-8 h-px bg-[#CC0000]" />
            <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
              Apply to Be a Guest
            </span>
            <DrawLine className="w-8 h-px bg-[#CC0000]" />
          </div>
        </FadeUp>

        <LineRevealScroll>
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-5xl lg:text-[5.5rem] text-white leading-tight tracking-wide mb-6">
            Your Story Belongs on{" "}
            <span className="text-[#CC0000]">GoTalk.</span>
          </h2>
        </LineRevealScroll>

        <FadeUp delay={0.2}>
          <p className="text-white/65 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Whether you&apos;re a founder, a leader, or a Sarawakian with a
            story worth hearing — the GoTalk chair is waiting.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-[#CC0000] text-white text-sm font-bold tracking-[0.2em] uppercase px-10 py-5 hover:bg-[#AA0000] active:scale-95 transition-all"
          >
            APPLY TO BE A GUEST
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturedEpisode />
        <ShowSegments />
        <FooterCTA />
      </main>
      <Footer />
    </>
  );
}
