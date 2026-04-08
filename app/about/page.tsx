import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title:       "About GoTalk Studios | Kuching, Sarawak",
  description: "Meet the team behind GoTalk Studios — Lionel Lapidos and Gordon Surein Raj — and the story behind Sarawak's premier talk show studio.",
  openGraph: {
    title:       "About GoTalk Studios | Kuching, Sarawak",
    description: "Meet the team behind GoTalk Studios — Lionel Lapidos and Gordon Surein Raj — and the story behind Sarawak's premier talk show studio.",
    url:         "https://gotalkstudios.com/about",
    type:        "website",
  },
  twitter: {
    title:       "About GoTalk Studios | Kuching, Sarawak",
    description: "Meet the team behind GoTalk Studios — Lionel Lapidos and Gordon Surein Raj — and the story behind Sarawak's premier talk show studio.",
  },
};
import {
  FadeUp,
  FadeIn,
  StaggerList,
  StaggerItem,
  ScaleIn,
  DrawLine,
  LineRevealScroll,
} from "@/components/motion";

function StudioStory() {
  return (
    <section className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <div>
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <DrawLine className="w-8 h-px bg-[#CC0000]" />
                <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                  Our Story
                </span>
              </div>
            </FadeIn>
            <LineRevealScroll>
              <h2 className="font-[family-name:var(--font-bebas-neue)] text-5xl lg:text-6xl text-white tracking-wide mb-8 leading-tight">
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
                <p className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-widest">
                  Real People.{" "}
                  <span className="text-[#CC0000]">Real Stories.</span> Real Sarawak.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <ScaleIn>
              {/* Studio image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A] mb-5">
                <Image
                  src="/kuching.jpg"
                  alt="Kuching, Sarawak"
                  fill
                  className="object-cover opacity-70"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="w-4 h-px bg-[#CC0000]" />
                  <span className="text-xs text-white/60 uppercase tracking-widest">
                    Kuching, Sarawak, Malaysia
                  </span>
                </div>
              </div>
            </ScaleIn>

            <FadeUp delay={0.15}>
              <div className="border border-white/10 bg-[#161616] p-8">
                <p className="text-[10px] text-[#CC0000] font-bold tracking-[0.3em] uppercase mb-4">
                  Our Mission
                </p>
                <p className="font-[family-name:var(--font-bebas-neue)] text-3xl text-white leading-tight tracking-wide">
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
      role: "Host",
      bio: "Lionel Lapidos is a host at GoTalk Studios. Known for his sharp questions and disarming warmth, Lionel has a rare ability to make guests feel at ease while drawing out the stories they've never told in public. His passion for Sarawak and its people is the heartbeat behind every GoTalk episode.",
      photo: "/lionel.png",
    },
    {
      name: "Gordon Surein Raj",
      role: "Founder & Host",
      bio: "Gordon Surein Raj is the founder and host of GoTalk Studios. His natural curiosity and instinct for storytelling make every conversation feel like the most important one you've ever heard. Gordon believes that Sarawak's greatest untapped resource is the stories sitting inside its people — and he's on a mission to bring them to light.",
      photo: "/gordon.jpg",
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
                The Hosts
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-5xl lg:text-6xl text-white tracking-wide">
              Meet the Hosts
            </h2>
          </div>
        </FadeUp>

        <StaggerList className="grid md:grid-cols-2 gap-4">
          {hosts.map((host) => (
            <StaggerItem key={host.name} className="h-full">
              <div className="group bg-[#111111] border border-white/8 hover:border-[#CC0000]/30 transition-colors overflow-hidden h-full flex flex-col">
                {/* Image area */}
                <div className="relative h-80 bg-[#1A1A1A] overflow-hidden">
                  <Image
                    src={host.photo}
                    alt={host.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: "50% 15%" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 via-transparent to-transparent" />
                  {/* Gradient bar at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#CC0000] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>

                <div className="p-8 flex-1">
                  <h3 className="font-[family-name:var(--font-bebas-neue)] text-3xl text-white tracking-wide mb-1">
                    {host.name}
                  </h3>
                  <p className="text-xs text-[#CC0000] font-bold uppercase tracking-[0.2em] mb-5">
                    {host.role}
                  </p>
                  <p className="text-sm text-white/65 leading-relaxed">{host.bio}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}

function AboutCTA() {
  return (
    <section className="py-20 bg-[#111111] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <FadeUp>
          <div>
            <h3 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-white tracking-wide mb-2">
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
              className="bg-[#CC0000] text-white text-xs font-bold tracking-[0.15em] uppercase px-7 py-4 hover:bg-[#AA0000] active:scale-95 transition-all"
            >
              APPLY TO BE A GUEST
            </Link>
            <Link
              href="/episodes"
              className="border border-white/30 text-white text-xs font-bold tracking-[0.15em] uppercase px-7 py-4 hover:border-white hover:bg-white/5 transition-all"
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
      <Navbar />
      <main className="pt-16">
        <div className="relative bg-[#111111] border-b border-white/10 overflow-hidden noise">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] to-[#111111]" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC0000]" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-5">
                <DrawLine delay={0.2} className="w-8 h-px bg-[#CC0000]" />
                <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                  About the Studio
                </span>
              </div>
            </FadeIn>
            <LineRevealScroll>
              <h1 className="font-[family-name:var(--font-bebas-neue)] text-6xl lg:text-8xl text-white tracking-wide">
                We Are GoTalk.
              </h1>
            </LineRevealScroll>
          </div>
        </div>
        <StudioStory />
        <Hosts />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}
