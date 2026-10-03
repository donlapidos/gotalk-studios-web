import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title:       "About",
  description: "Meet the team behind GoTalk Studios — Lionel Lapidos and Gordon Surein Raj — and the story behind Sarawak's premier talk show studio.",
  openGraph: {
    title:       "About",
    description: "Meet the team behind GoTalk Studios — Lionel Lapidos and Gordon Surein Raj — and the story behind Sarawak's premier talk show studio.",
    url:         "https://gotalkstudios.com/about",
    type:        "website",
  },
  twitter: {
    title:       "About",
    description: "Meet the team behind GoTalk Studios — Lionel Lapidos and Gordon Surein Raj — and the story behind Sarawak's premier talk show studio.",
  },
};
import {
  FadeUp,
  ScaleIn,
  LineRevealScroll,
  ClipReveal,
} from "@/components/motion";

function StudioStory() {
  return (
    <section className="py-24 bg-surface-base">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <div>
            <LineRevealScroll>
              <h2 className="font-display text-5xl lg:text-6xl text-white tracking-wide mb-8 leading-tight">
                Born in Kuching.<br />Built for Sarawak.
              </h2>
            </LineRevealScroll>
            <FadeUp delay={0.1}>
              <div className="space-y-5 text-white/70 leading-relaxed text-[15px]">
                <p>GoTalk Studios was born from a simple belief — that Sarawak has stories worth telling, and people worth hearing.</p>
                <p>Based in Kuching, we are a homegrown media studio dedicated to authentic, unscripted conversations with the people shaping our land. From the entrepreneur grinding in a Kuching shophouse to the leader in the corridors of power — we pull up a chair, turn on the mics, and let them talk.</p>
                <p>GoTalk started with the builders — the founders, operators, and risk-takers driving Sarawak&apos;s entrepreneurial spirit. Now expanding to the decision-makers in politics and the icons who define our culture. Every conversation is a piece of Sarawak&apos;s story.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="font-display text-2xl text-white tracking-widest">
                  Real People.{" "}
                  <span className="text-brand-red">Real Stories.</span> Real Sarawak.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <ScaleIn>
              {/* Studio image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-raised mb-5">
                <Image
                  src="/kuching.jpg"
                  alt="Kuching, Sarawak"
                  fill
                  className="object-cover opacity-70"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="w-4 h-px bg-brand-red" />
                  <span className="text-xs text-white/60 uppercase tracking-widest">
                    Kuching, Sarawak, Malaysia
                  </span>
                </div>
              </div>
            </ScaleIn>

            <FadeUp delay={0.15}>
              <div className="border border-white/10 bg-surface-alt p-8">
                <p className="text-2xs text-accent font-bold tracking-label uppercase mb-4">
                  Our Mission
                </p>
                <p className="font-display text-3xl text-white leading-tight tracking-wide">
                  To be the definitive voice of Sarawak — one honest conversation at a time.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hosts() {
  const hosts = [
    {
      name: "Lionel Lapidos",
      role: "Co-Founder & Host",
      bio: "Lionel Lapidos is a co-founder and host of GoTalk Studios. Known for his sharp questions and disarming warmth, Lionel has a rare ability to make guests feel at ease while drawing out the stories they've never told in public. His passion for Sarawak and its people is the heartbeat behind every GoTalk episode.",
      photo: "/lionel.png",
    },
    {
      name: "Gordon Surein Raj",
      role: "Co-Founder & Host",
      bio: "Gordon Surein Raj is a co-founder and host of GoTalk Studios. His natural curiosity and instinct for storytelling make every conversation feel like the most important one you've ever heard. Gordon believes that Sarawak's greatest untapped resource is the stories sitting inside its people — and he's on a mission to bring them to light.",
      photo: "/gordon.jpg",
    },
  ];

  return (
    <section className="py-24 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeUp>
          <div className="mb-14">
            <div className="section-head mb-5">
              <span className="section-label">The Founders</span>
              <span aria-hidden="true" className="section-head__rule" />
            </div>
            <h2 className="font-display text-5xl lg:text-6xl text-white tracking-wide leading-[0.9]">
              Meet the Hosts
            </h2>
          </div>
        </FadeUp>

        {/* Plain grid: ClipReveal self-manages its own reveal, so wrapping these in
            a stagger container would set up variants nothing consumes. */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Full colour. These were keyed through a red duotone to hide that the
              two portraits come from different shoots; the tint read as a filter
              over the people instead. Replace both with one shoot on the set. */}
          {hosts.map((host, i) => (
            <ClipReveal key={host.name} delay={i * 0.14} className="h-full">
              <article className="group flex flex-col h-full bg-surface-raised border border-white/10 overflow-hidden">
                {/* 3:2 rather than 4:5: at portrait ratio the pair ran taller than
                    a viewport, and the extra height was all light area. */}
                <div className="relative aspect-[3/2] bg-surface-raised overflow-hidden shrink-0">
                  <Image
                    src={host.photo}
                    alt={`${host.name}, ${host.role} at GoTalk Studios`}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    style={{ objectPosition: "50% 18%" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>

                <div className="flex-1 px-6 pt-5 pb-6 flex flex-col">
                  <h3 className="font-display text-3xl text-white tracking-wide leading-[0.95] mb-1">
                    {host.name}
                  </h3>
                  <p className="text-2xs text-white/55 font-bold uppercase tracking-label mb-4">
                    {host.role}
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed max-w-[56ch]">
                    {host.bio}
                  </p>
                </div>
              </article>
            </ClipReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutCTA() {
  return (
    <section className="py-20 bg-surface-base border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <FadeUp>
          <div>
            <h3 className="font-display text-4xl text-white tracking-wide mb-2">
              Want to Be Part of the Story?
            </h3>
            <p className="text-white/65 text-sm">
              Apply to be a guest or reach out to discuss partnerships.
            </p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap gap-4 flex-shrink-0">
            <Link
              href="/contact"
              className="bg-brand-red text-white text-xs font-bold tracking-wide uppercase px-7 py-4 hover:bg-brand-red-hover active:scale-95 transition-all"
            >
              APPLY TO BE A GUEST
            </Link>
            <Link
              href="/episodes"
              className="border border-white/30 text-white text-xs font-bold tracking-wide uppercase px-7 py-4 hover:border-white hover:bg-white/5 transition-all"
            >
              WATCH EPISODES
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="pt-16">
        <div className="relative bg-surface-base border-b border-white/10 overflow-hidden noise">
          <div className="absolute inset-0 bg-gradient-to-b from-surface-sunken to-surface-base" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <LineRevealScroll>
              <h1 className="font-display text-6xl lg:text-8xl text-white tracking-wide">
                We Are GoTalk.
              </h1>
            </LineRevealScroll>
          </div>
        </div>
        <StudioStory />
        <Hosts />
        <AboutCTA />
      </main>
    </>
  );
}
