import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { sanityFetch } from '@/sanity/lib/live'
import { ALL_SERVICES_QUERY } from '@/sanity/lib/queries'
import { FadeIn, FadeUp, DrawLine } from '@/components/motion'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Services | GoTalk Studios',
  description:
    'Professional production services for businesses, creators, and brands in Sarawak — podcast studio rental, videography, drone, and video editing.',
  openGraph: {
    title: 'Services | GoTalk Studios',
    description:
      'Professional production services for businesses, creators, and brands in Sarawak — podcast studio rental, videography, drone, and video editing.',
    url: 'https://gotalkstudios.com/services',
    type: 'website',
  },
  twitter: {
    title: 'Services | GoTalk Studios',
    description:
      'Professional production services for businesses, creators, and brands in Sarawak — podcast studio rental, videography, drone, and video editing.',
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PricingRow = {
  duration: string
  price: string
}

type Service = {
  _id: string
  serviceNumber: string | null
  name: string
  tagline: string | null
  features: string[] | null
  perfectFor: string | null
  featured: boolean | null
  pricingRows: PricingRow[] | null
  pricingNote: string | null
}

// ─── Pricing Table ────────────────────────────────────────────────────────────

function PricingTable({
  rows,
  note,
  compact = false,
}: {
  rows: PricingRow[]
  note?: string | null
  compact?: boolean
}) {
  return (
    <div className="mt-4">
      <div className="flex justify-between px-3 pb-2">
        <span className="text-white/40 font-bold tracking-[0.2em] uppercase text-[9px]">
          {compact ? 'Package' : 'Duration'}
        </span>
        <span className="text-white/40 font-bold tracking-[0.2em] uppercase text-[9px]">
          Rate (RM)
        </span>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex justify-between items-center px-3"
          style={{
            backgroundColor: i % 2 === 0 ? '#1A1A1A' : '#222222',
            paddingTop: compact ? '6px' : '10px',
            paddingBottom: compact ? '6px' : '10px',
          }}
        >
          <span className={`text-white/70 ${compact ? 'text-[11px]' : 'text-xs'}`}>{row.duration}</span>
          <span className={`text-[#CC0000] font-bold ${compact ? 'text-[11px]' : 'text-xs'}`}>{row.price}</span>
        </div>
      ))}
      {note && (
        <p className="text-white/35 text-[10px] italic mt-1.5 px-3">{note}</p>
      )}
    </div>
  )
}

// ─── Featured Card (full-width two-column hero card) ─────────────────────────

function FeaturedCard({ service, index }: { service: Service; index: number }) {
  const reversed = index % 2 === 1

  const contentCol = (
    <div className="bg-[#111111] p-10 lg:p-14 flex flex-col min-h-[500px] lg:min-h-[560px]">
      <div className="flex-1">
        {service.serviceNumber && (
          <p
            className="font-[family-name:var(--font-bebas-neue)] text-[#CC0000] leading-none mb-2"
            style={{ fontSize: 'clamp(4rem, 7vw, 7rem)' }}
          >
            {service.serviceNumber}
          </p>
        )}

        <h2
          className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-3"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', letterSpacing: '0.02em' }}
        >
          {service.name}
        </h2>

        {service.tagline && (
          <p className="text-[#CC0000]/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
            {service.tagline}
          </p>
        )}

        {service.features && service.features.length > 0 && (
          <ul className="space-y-3 mb-6">
            {service.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-3 h-3 bg-[#CC0000] shrink-0" aria-hidden="true" />
                <span className="text-white/70 text-xs font-semibold tracking-[0.15em] uppercase">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        {service.perfectFor && (
          <div className="bg-[#2A0000] border-l-2 border-[#CC0000] px-4 py-3 mb-6">
            <p className="text-[#CC0000] text-[9px] font-bold tracking-[0.3em] uppercase mb-1">
              Perfect For
            </p>
            <p className="text-white/70 text-xs leading-relaxed">{service.perfectFor}</p>
          </div>
        )}
      </div>

      {service.pricingRows && service.pricingRows.length > 0 && (
        <PricingTable rows={service.pricingRows} note={service.pricingNote} />
      )}
    </div>
  )

  const darkCol = (
    <div
      className="relative flex items-center justify-center overflow-hidden min-h-[280px] md:min-h-0"
      style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #111111 50%, #0D0D0D 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: reversed
            ? 'radial-gradient(ellipse 70% 50% at 25% 65%, rgba(204,0,0,0.1) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 70% 50% at 75% 35%, rgba(204,0,0,0.1) 0%, transparent 65%)',
        }}
      />
      {service.serviceNumber && (
        <span
          className="font-[family-name:var(--font-bebas-neue)] text-white select-none pointer-events-none"
          style={{
            fontSize: 'clamp(10rem, 22vw, 20rem)',
            lineHeight: 1,
            opacity: 0.05,
            letterSpacing: '-0.02em',
          }}
        >
          {service.serviceNumber}
        </span>
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-l-4 border-[#CC0000] border-y border-r border-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(204,0,0,0.12)]">
      {reversed ? (
        <>{darkCol}{contentCol}</>
      ) : (
        <>{contentCol}{darkCol}</>
      )}
    </div>
  )
}

// ─── Compact Card ─────────────────────────────────────────────────────────────

function CompactCard({ service }: { service: Service }) {
  return (
    <div className="bg-[#111111] border border-white/[0.08] p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-[#CC0000]/50">
      {service.serviceNumber && (
        <p
          className="font-[family-name:var(--font-bebas-neue)] text-[#CC0000]/60 leading-none mb-1"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          {service.serviceNumber}
        </p>
      )}

      <h3
        className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-1.5"
        style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
      >
        {service.name}
      </h3>

      {service.tagline && (
        <p className="text-[#CC0000]/60 text-[9px] font-bold tracking-[0.25em] uppercase mb-3">
          {service.tagline}
        </p>
      )}

      {service.features && service.features.length > 0 && (
        <ul className="space-y-1.5 mb-4">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#CC0000] shrink-0" aria-hidden="true" />
              <span className="text-white/70 text-[11px] font-semibold tracking-[0.1em] uppercase">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}

      {service.perfectFor && (
        <div className="bg-[#CC0000] px-3 py-2.5 mb-3">
          <p className="text-white/80 text-[9px] font-bold tracking-[0.3em] uppercase mb-0.5">
            Perfect For
          </p>
          <p className="text-white text-xs leading-relaxed">{service.perfectFor}</p>
        </div>
      )}

      {service.pricingRows && service.pricingRows.length > 0 && (
        <div className="mt-auto">
          <PricingTable rows={service.pricingRows} note={service.pricingNote} compact />
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServicesPage() {
  const { data } = await sanityFetch({ query: ALL_SERVICES_QUERY })
  const services = (data ?? []) as Service[]

  const featured = services.filter((s) => s.featured)
  const compact = services.filter((s) => !s.featured)

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#111111] min-h-screen">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="relative bg-[#0D0D0D] border-b border-white/5 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 50% 80% at 0% 100%, rgba(204,0,0,0.12) 0%, transparent 65%)',
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
            <FadeIn delay={0.05}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-[2px] bg-[#CC0000] inline-block" />
                <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.35em] uppercase">
                  What We Offer
                </span>
              </div>
            </FadeIn>

            <FadeUp delay={0.15}>
              <h1
                className="font-[family-name:var(--font-bebas-neue)] uppercase"
                style={{ fontSize: 'clamp(4.5rem, 12vw, 11rem)', lineHeight: 0.9 }}
              >
                <span className="block text-white">STUDIO</span>
                <span
                  className="block"
                  style={{ color: 'transparent', WebkitTextStroke: '2px #CC0000' }}
                >
                  SERVICES
                </span>
              </h1>
            </FadeUp>

            <FadeIn delay={0.3}>
              <DrawLine delay={0.35} className="w-16 h-[2px] bg-[#CC0000] mt-5 mb-5" />
              <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                Professional production services for businesses, creators, and brands in Sarawak.
                High-fidelity gear, expert operators, and creative space.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* ── Featured Services — full-width hero cards ─────────── */}
        {featured.length > 0 && (
          <section className="space-y-[2px] pt-[2px]">
            {featured.map((service, index) => (
              <FadeUp key={service._id} delay={0.1 + index * 0.08}>
                <FeaturedCard service={service} index={index} />
              </FadeUp>
            ))}
          </section>
        )}

        {/* ── Additional Services — compact 3-col grid ──────────── */}
        {compact.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
            <FadeIn delay={0.05}>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-6 h-[2px] bg-[#CC0000] inline-block" />
                <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.35em] uppercase">
                  Additional Services
                </span>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
              {compact.map((service, index) => (
                <FadeUp key={service._id} delay={0.05 + index * 0.06}>
                  <CompactCard service={service} />
                </FadeUp>
              ))}
            </div>
          </section>
        )}

        {/* ── Booking CTA ──────────────────────────────────────── */}
        <section className="bg-[#CC0000] py-20 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-5"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.02em' }}
            >
              Ready to Book?
            </h2>
            <p className="text-white/80 text-sm font-bold tracking-[0.2em] uppercase mb-10">
              Contact us to check availability and confirm your session.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-block bg-white text-[#CC0000] text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#F0F0EE] active:scale-95 transition-all"
              >
                BOOK NOW
              </Link>
              <Link
                href="/contact"
                className="inline-block border-2 border-white text-white text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-white/10 active:scale-95 transition-all"
              >
                GET IN TOUCH
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
