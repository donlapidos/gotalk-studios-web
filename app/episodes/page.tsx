import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SegmentShelf from "@/components/SegmentShelf";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_EPISODES_QUERY } from "@/sanity/lib/queries";
import { extractYouTubeId } from "@/lib/youtube";
import { FadeIn, FadeUp, DrawLine } from "@/components/motion";

export const metadata: Metadata = {
  title:       "The Conversations | GoTalk Studios",
  description: "Browse all GoTalk Studios episodes — from Sarawak's boldest entrepreneurs to its most powerful public figures.",
  openGraph: {
    title:       "The Conversations | GoTalk Studios",
    description: "Browse all GoTalk Studios episodes — from Sarawak's boldest entrepreneurs to its most powerful public figures.",
    url:         "https://gotalkstudios.com/episodes",
    type:        "website",
  },
  twitter: {
    title:       "The Conversations | GoTalk Studios",
    description: "Browse all GoTalk Studios episodes — from Sarawak's boldest entrepreneurs to its most powerful public figures.",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Episode = {
  _id: string
  title: string
  episodeNumber: number
  season: number
  segment: 'Business' | 'Politics' | 'Icons'
  guestName: string
  guestCompany: string | null
  youtubeUrl: string | null
  description: string | null
  publishedAt: string | null
  featured: boolean
}

// ─── Featured Hero ────────────────────────────────────────────────────────────

function FeaturedHero({ episode }: { episode: Episode }) {
  const videoId = extractYouTubeId(episode.youtubeUrl)
  const ytUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null

  return (
    <div className="relative min-h-[75vh] flex flex-col justify-center overflow-hidden bg-[#0D0D0D]">
      {/* Red glow — bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 0% 100%, rgba(204,0,0,0.18) 0%, rgba(204,0,0,0.06) 45%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

      {/* Content — left-aligned, max ~55% width */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-[55%] min-w-[320px]">

          {/* EP badge + red underline */}
          <FadeIn delay={0.1}>
            <div className="mb-2">
              <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.3em] uppercase">
                EP {episode.episodeNumber} — SEASON {episode.season}
              </span>
              <DrawLine delay={0.2} className="w-7 h-[2px] bg-[#CC0000] mt-1.5" />
            </div>
          </FadeIn>

          {/* Guest name */}
          <FadeIn delay={0.3}>
            <p className="text-white/60 text-xs font-bold tracking-[0.25em] uppercase mb-4">
              {episode.guestName}
              {episode.guestCompany && (
                <span className="text-white/35"> — {episode.guestCompany}</span>
              )}
            </p>
          </FadeIn>

          {/* Episode title */}
          <FadeUp delay={0.4}>
            <h1
              className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-5"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)', letterSpacing: '0.02em' }}
            >
              {episode.title}
            </h1>
          </FadeUp>

          {/* Description */}
          {episode.description && (
            <FadeUp delay={0.55}>
              <p className="text-white/55 leading-relaxed mb-8 text-sm">
                {episode.description}
              </p>
            </FadeUp>
          )}

          {/* CTA */}
          {ytUrl && (
            <FadeUp delay={0.65}>
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#CC0000] text-white text-xs font-bold tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-[#AA0000] active:scale-95 transition-all"
              >
                WATCH ON YOUTUBE
                <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                  <span className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent border-l-white ml-0.5" />
                </span>
              </a>
            </FadeUp>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EpisodesPage() {
  const { data: episodes } = await sanityFetch({ query: ALL_EPISODES_QUERY })
  const allEps = (episodes ?? []) as Episode[]

  const featured    = allEps.find((ep) => ep.featured) ?? allEps[0] ?? null
  const businessEps = allEps.filter((ep) => ep.segment === 'Business')
  const politicsEps = allEps.filter((ep) => ep.segment === 'Politics')
  const iconsEps    = allEps.filter((ep) => ep.segment === 'Icons')

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#111111] min-h-screen">

        {featured && <FeaturedHero episode={featured} />}

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <SegmentShelf
            title="GOTALK BUSINESS"
            subtitle="Sarawak Local Entrepreneurs"
            episodes={businessEps}
            placeholderStyle="none"
          />
          <SegmentShelf
            title="GOTALK POLITICS"
            subtitle="Candid conversations with Sarawak's leaders"
            episodes={politicsEps}
            placeholderStyle="ep-number"
          />
          <SegmentShelf
            title="GOTALK ICONS"
            subtitle="Legendary figures & culture"
            episodes={iconsEps}
            placeholderStyle="coming-soon"
          />
        </div>

      </main>
      <Footer />
    </>
  )
}
