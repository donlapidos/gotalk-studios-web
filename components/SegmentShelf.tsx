'use client'

import { extractYouTubeId } from '@/lib/youtube'
import { FadeUp, StaggerList, StaggerItem } from '@/components/motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Episode = {
  _id: string
  title: string
  episodeNumber: number
  season: number
  segment: string
  guestName: string
  guestCompany: string | null
  youtubeUrl: string | null
  description: string | null
  publishedAt: string | null
  featured: boolean
}

type PlaceholderStyle = 'ep-number' | 'coming-soon' | 'none'

type Props = {
  title: string
  subtitle: string
  episodes: Episode[]
  placeholderStyle?: PlaceholderStyle
}

// ─── Mic Icon ─────────────────────────────────────────────────────────────────

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" aria-hidden="true">
      <rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" />
      <path
        d="M5 11a7 7 0 0014 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8"  y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Episode Card ─────────────────────────────────────────────────────────────

function CardBody({ ep }: { ep: Episode }) {
  return (
    <>
      {/* ── Off-white header ── */}
      <div className="bg-[#F0F0EE] px-4 pt-4 pb-5 flex flex-col min-h-[160px]">
        <div className="flex items-start justify-between mb-2">
          <span className="text-[#CC0000] text-[11px] font-black tracking-[0.15em] uppercase leading-none">
            EP {String(ep.episodeNumber).padStart(2, '0')}
          </span>
          <span className="text-[#CC0000]">
            <MicIcon />
          </span>
        </div>
        <div className="mt-auto">
          <h3
            className="font-[family-name:var(--font-bebas-neue)] text-[#111111] leading-[1.0] break-words"
            style={{ fontSize: 'clamp(1.65rem, 3vw, 2.2rem)', letterSpacing: '0.03em' }}
          >
            {ep.guestName.toUpperCase()}
          </h3>
          {ep.guestCompany && (
            <p className="text-[10px] text-gray-400 mt-1.5 tracking-widest uppercase">
              {ep.guestCompany}
            </p>
          )}
        </div>
      </div>

      {/* ── Red separator ── */}
      <div className="h-[3px] bg-[#CC0000]" />

      {/* ── Dark body ── */}
      <div className="bg-[#181818] px-4 py-3.5 flex flex-col justify-between flex-1 min-h-[80px]">
        <p className="text-white text-[11px] font-bold uppercase tracking-[0.08em] leading-snug mb-3 line-clamp-2">
          {ep.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-white/30 text-[10px] tracking-wide uppercase">
            S{ep.season} · Ep {ep.episodeNumber}
          </span>
          <span className="text-[#CC0000] text-[1.1rem] leading-none group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </>
  )
}

function EpisodeCard({ ep }: { ep: Episode }) {
  const videoId = extractYouTubeId(ep.youtubeUrl)
  const ytUrl   = videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined
  const cls     = "group flex flex-col border border-[#222]"

  if (!ytUrl) {
    return <div className={cls}><CardBody ep={ep} /></div>
  }
  return (
    <a href={ytUrl} target="_blank" rel="noopener noreferrer" className={cls}>
      <CardBody ep={ep} />
    </a>
  )
}

// ─── EP Number Placeholder ────────────────────────────────────────────────────

function EpNumberCard({ epNum }: { epNum: number }) {
  return (
    <div className="bg-[#141414] border border-[#1e1e1e] flex items-center justify-center min-h-[260px]">
      <span
        className="font-[family-name:var(--font-bebas-neue)] text-white/[0.10] tracking-[0.12em]"
        style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)' }}
      >
        EP {String(epNum).padStart(2, '0')}
      </span>
    </div>
  )
}

// ─── Coming Soon Placeholder ──────────────────────────────────────────────────

function ComingSoonCard() {
  return (
    <div className="bg-[#141414] border border-[#1e1e1e] flex items-center justify-center min-h-[260px]">
      <span className="text-[11px] text-white/20 font-bold tracking-[0.35em] uppercase">
        Coming Soon
      </span>
    </div>
  )
}

// ─── Shelf ────────────────────────────────────────────────────────────────────

export default function SegmentShelf({
  title,
  subtitle,
  episodes,
  placeholderStyle = 'ep-number',
}: Props) {
  const COLS = 4
  const sorted = [...episodes].sort((a, b) => b.episodeNumber - a.episodeNumber)

  // Determine placeholder slots
  let placeholderCount = 0
  let placeholderEpNums: number[] = []

  if (placeholderStyle !== 'none') {
    const minTotal    = Math.max(sorted.length, COLS)
    const paddedTotal = Math.ceil(minTotal / COLS) * COLS
    placeholderCount  = paddedTotal - sorted.length
    const maxEp       = sorted[0]?.episodeNumber ?? 0
    placeholderEpNums = Array.from({ length: placeholderCount }, (_, i) => maxEp + i + 1)
  }

  return (
    <div className="mb-16">

      {/* Shelf header */}
      <FadeUp>
        <div className="mb-5">
          <h2
            className="font-[family-name:var(--font-bebas-neue)] text-[#CC0000] tracking-wide"
            style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)' }}
          >
            {title}
          </h2>
          <p className="text-white/35 text-[10px] tracking-[0.3em] uppercase mt-1">
            {subtitle}
          </p>
        </div>
      </FadeUp>

      {/* Card grid */}
      <StaggerList className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sorted.map((ep) => (
          <StaggerItem key={ep._id}>
            <EpisodeCard ep={ep} />
          </StaggerItem>
        ))}
        {placeholderStyle === 'ep-number' &&
          placeholderEpNums.map((n) => (
            <StaggerItem key={`ph-${n}`}>
              <EpNumberCard epNum={n} />
            </StaggerItem>
          ))}
        {placeholderStyle === 'coming-soon' &&
          Array.from({ length: placeholderCount }).map((_, i) => (
            <StaggerItem key={`cs-${i}`}>
              <ComingSoonCard />
            </StaggerItem>
          ))}
      </StaggerList>

    </div>
  )
}
