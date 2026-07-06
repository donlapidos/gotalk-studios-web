import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/live'
import { GUEST_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { imageUrl, type SanityImageValue } from '@/sanity/lib/image'
import SanityImage from '@/components/SanityImage'
import { guestPtComponents } from '@/components/portable-text'
import { extractYouTubeId } from '@/lib/youtube'
import { FadeIn, FadeUp, SlideInLeft, DrawLineY, StaggerList, StaggerItem } from '@/components/motion'
import GuestShareButton from '@/components/GuestShareButton'

// ─── Types ────────────────────────────────────────────────────────────────────

type SocialLinks = {
  instagram?: string | null
  linkedin?: string | null
  website?: string | null
  facebook?: string | null
}

type Episode = {
  _id: string
  title: string | null
  episodeNumber: number
  youtubeUrl: string | null
  shortDescription: string | null
  season: number
}

type Guest = {
  _id: string
  name: string
  slug: { current: string }
  photo: SanityImageValue | null
  title: string | null
  company: string | null
  bio: unknown[]
  quote: string | null
  segment: string | null
  domainFocus: string[] | null
  socialLinks: SocialLinks | null
  featured: boolean | null
  episode: Episode | null
}

type Props = {
  params: Promise<{ slug: string }>
}

// ─── Data fetching ────────────────────────────────────────────────────────────

const getGuest = cache(async (slug: string) => {
  const { data } = await sanityFetch({ query: GUEST_BY_SLUG_QUERY, params: { slug } })
  return data as Guest | null
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guest = await getGuest(slug)
  if (!guest) return { title: 'Guest Not Found' }

  const description = guest.quote ?? `${guest.name} on GoTalk Studios — ${guest.title ?? ''}`
  const ogImageUrl = imageUrl(guest.photo, 1200, 630) ?? '/og-image.jpg'

  return {
    title: guest.name,
    description,
    openGraph: {
      title: `${guest.name} | GoTalk Studios`,
      description,
      url: `https://gotalkstudios.com/guests/${slug}`,
      type: 'profile',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: guest.name }],
    },
    twitter: {
      title: `${guest.name} | GoTalk Studios`,
      description,
      images: [ogImageUrl],
    },
  }
}

// ─── Social icon helpers ──────────────────────────────────────────────────────


function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

// ─── Name split helper ────────────────────────────────────────────────────────

function splitName(name: string): [string, string] {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return [parts[0], '']
  const last = parts.pop()!
  return [parts.join(' '), last]
}

// ─── Quote split helper ───────────────────────────────────────────────────────

function splitQuoteTail(quote: string): [string, string] {
  const trimmed = quote.trim()
  // Make the last word red
  const words = trimmed.split(' ')
  if (words.length <= 1) return ['', trimmed]
  const last = words.pop()!
  return [words.join(' ') + ' ', last]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GuestBioPage({ params }: Props) {
  const { slug } = await params
  const guest = await getGuest(slug)

  if (!guest) notFound()

  const [firstName, lastName] = splitName(guest.name)

  // Episode & YouTube
  const videoId = extractYouTubeId(guest.episode?.youtubeUrl)
  const ytUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null

  // Quote
  const [quoteHead, quoteTail] = guest.quote ? splitQuoteTail(guest.quote) : ['', '']

  // Social link for copy URL
  const pageUrl = `https://gotalkstudios.com/guests/${slug}`

  return (
    <>
      <main className="pt-16 bg-[#111111] min-h-screen">

        {/* ── Top back-link ──────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 border-b border-white/5">
          <Link
            href="/guests"
            className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors"
          >
            ← Back to Guests
          </Link>
        </div>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="grid lg:grid-cols-2 min-h-[85vh]">

          {/* Left: Photo */}
          <SlideInLeft className="relative h-[70vw] lg:h-auto overflow-hidden bg-[#0A0A0A]">
            {guest.photo?.asset ? (
              <SanityImage
                image={guest.photo}
                alt={guest.name}
                width={900}
                height={1200}
                priority
                useHotspot
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]">
                <svg viewBox="0 0 24 24" className="w-40 h-40 text-white/5" fill="currentColor" aria-hidden="true">
                  <path d="M12 12a5 5 0 110-10 5 5 0 010 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" />
                </svg>
              </div>
            )}
            {/* Dark vignette on right edge */}
            <div className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(to right, transparent 70%, rgba(0,0,0,0.5) 100%)' }} />
          </SlideInLeft>

          {/* Right: Info */}
          <div className="relative bg-[#0D0D0D] flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-16 lg:py-20 overflow-hidden">
            {/* Decorative rotated text */}
            <span
              className="absolute right-6 top-1/2 text-white/[0.04] text-[11px] font-bold tracking-[0.5em] uppercase hidden lg:block select-none"
              style={{ transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'center', whiteSpace: 'nowrap' }}
              aria-hidden="true"
            >
              {guest.name} / GoTalk Studios
            </span>

            {/* Segment tag */}
            <FadeIn delay={0.1}>
              <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.3em] uppercase">
                {guest.segment ? `${guest.segment} · ` : ''}Featured Guest
              </span>
            </FadeIn>

            {/* Name */}
            <div className="mt-5 mb-6">
              <FadeUp delay={0.2}>
                <span
                  className="block font-[family-name:var(--font-bebas-neue)] text-white leading-[0.9]"
                  style={{ fontSize: 'clamp(3.5rem, 8vw, 8.5rem)', letterSpacing: '0.01em' }}
                >
                  {firstName || guest.name}
                </span>
              </FadeUp>
              {lastName && (
                <FadeUp delay={0.35}>
                  <span
                    className="block font-[family-name:var(--font-bebas-neue)] text-[#CC0000] leading-[0.9]"
                    style={{ fontSize: 'clamp(3.5rem, 8vw, 8.5rem)', letterSpacing: '0.01em' }}
                  >
                    {lastName}
                  </span>
                </FadeUp>
              )}
            </div>

            <FadeIn delay={0.5}>
              {guest.title && (
                <p className="text-white text-sm font-bold tracking-[0.25em] uppercase">
                  {guest.title}
                </p>
              )}
              {guest.company && (
                <p className="text-white/35 text-xs tracking-[0.2em] uppercase mt-1.5">
                  {guest.company}
                </p>
              )}
            </FadeIn>

            {/* Episode badge */}
            {guest.episode && (
              <FadeIn delay={0.65}>
                <div className="mt-8 flex items-center gap-3">
                  <span className="w-6 h-px bg-[#CC0000] inline-block" />
                  <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">
                    Episode {guest.episode.episodeNumber} · Season {guest.episode.season}
                  </span>
                </div>
              </FadeIn>
            )}
          </div>

        </section>

        {/* ── Quote ─────────────────────────────────────────────── */}
        {guest.quote && (
          <section className="bg-[#0A0A0A] border-t border-white/5 py-20 lg:py-28">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
              <div className="flex gap-6 lg:gap-10">

                {/* Animated vertical red border */}
                <DrawLineY
                  delay={0.5}
                  className="w-1 bg-[#CC0000] shrink-0 self-stretch"
                />

                <div className="min-w-0">
                  <FadeIn delay={0.2}>
                    <span
                      className="font-[family-name:var(--font-bebas-neue)] text-[#CC0000] leading-none block"
                      style={{ fontSize: 'clamp(4rem, 8vw, 7rem)' }}
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>
                  </FadeIn>

                  <FadeUp delay={0.7}>
                    <blockquote
                      className="font-bold text-white uppercase"
                      style={{
                        fontSize: 'clamp(1.25rem, 2.8vw, 2.2rem)',
                        letterSpacing: '0.02em',
                        lineHeight: 1.2,
                      }}
                    >
                      {quoteHead}
                      <span className="text-[#CC0000]">{quoteTail}</span>
                    </blockquote>
                  </FadeUp>

                  {guest.episode && (
                    <FadeIn delay={0.9}>
                      <div className="mt-8 flex items-center gap-4">
                        <div className="w-10 h-px bg-[#CC0000]" />
                        <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
                          From Episode {guest.episode.episodeNumber}
                          {guest.episode.title ? `: ${guest.episode.title}` : ''}
                        </p>
                      </div>
                    </FadeIn>
                  )}
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ── Bio + Connect ──────────────────────────────────────── */}
        <section className="bg-[#111111] border-t border-white/5 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[3fr_1fr] gap-12 lg:gap-20">

              {/* Left: Biography */}
              <div>
                <FadeIn delay={0.1}>
                  <h2
                    className="font-[family-name:var(--font-bebas-neue)] text-white tracking-wide mb-8"
                    style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
                  >
                    Biography
                  </h2>
                </FadeIn>

                {guest.bio && guest.bio.length > 0 ? (
                  <FadeUp delay={0.2}>
                    <PortableText value={guest.bio as Parameters<typeof PortableText>[0]['value']} components={guestPtComponents} />
                  </FadeUp>
                ) : (
                  <p className="text-white/30 text-sm italic">No biography available.</p>
                )}

                {/* Domain Focus */}
                {guest.domainFocus && guest.domainFocus.length > 0 && (
                  <div className="mt-10">
                    <p className="text-[#CC0000] text-[10px] font-bold tracking-[0.35em] uppercase mb-4">
                      Domain Focus
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {guest.domainFocus.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 border border-[#333] text-[#CC0000] text-[11px] font-bold tracking-[0.12em] uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Connect */}
              <div>
                <FadeIn delay={0.15}>
                  <p className="text-white/30 text-[10px] font-bold tracking-[0.35em] uppercase mb-5">
                    Connect
                  </p>
                </FadeIn>

                <StaggerList className="flex flex-row gap-3 items-center">
                  {/* Share */}
                  <StaggerItem>
                    <GuestShareButton url={pageUrl} name={guest.name} />
                  </StaggerItem>

                  {/* Website */}
                  {guest.socialLinks?.website && (
                    <StaggerItem>
                      <a
                        href={guest.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-colors"
                        aria-label="Website"
                      >
                        <GlobeIcon />
                      </a>
                    </StaggerItem>
                  )}

                  {/* Instagram */}
                  {guest.socialLinks?.instagram && (
                    <StaggerItem>
                      <a
                        href={guest.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-colors"
                        aria-label="Instagram"
                      >
                        <InstagramIcon />
                      </a>
                    </StaggerItem>
                  )}

                  {/* LinkedIn */}
                  {guest.socialLinks?.linkedin && (
                    <StaggerItem>
                      <a
                        href={guest.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <LinkedinIcon />
                      </a>
                    </StaggerItem>
                  )}
                </StaggerList>
              </div>

            </div>
          </div>
        </section>

        {/* ── Episode ───────────────────────────────────────────── */}
        {guest.episode && (
          <section className="bg-[#0D0D0D] border-t border-white/5 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <FadeUp delay={0.4}>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                  {/* Left: YouTube embed */}
                  <div className="w-full aspect-video bg-[#0A0A0A]">
                    {videoId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                        title={guest.episode.title ?? `Episode ${guest.episode.episodeNumber}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/20 text-xs tracking-widest uppercase">No video available</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Episode info */}
                  <div>
                    <p className="text-[#CC0000] text-[11px] font-bold tracking-[0.3em] uppercase mb-3">
                      Now Playing
                    </p>
                    <h3
                      className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-4"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '0.02em' }}
                    >
                      EP. {guest.episode.episodeNumber}: {guest.episode.title}
                    </h3>
                    {guest.episode.shortDescription && (
                      <p className="text-white/45 text-sm leading-relaxed mb-7">
                        {guest.episode.shortDescription}
                      </p>
                    )}
                    {ytUrl ? (
                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-[#CC0000] text-white text-xs font-bold tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-[#AA0000] active:scale-95 transition-all"
                      >
                        Watch Episode
                        <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                          <span className="border-t-[4px] border-b-[4px] border-l-[6px] border-transparent border-l-white ml-0.5" style={{ display: 'inline-block' }} />
                        </span>
                      </a>
                    ) : null}
                  </div>

                </div>
              </FadeUp>
            </div>
          </section>
        )}

        {/* ── Back link ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 border-t border-white/5">
          <Link
            href="/guests"
            className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors"
          >
            ← Back to Guests
          </Link>
        </div>

      </main>
    </>
  )
}
