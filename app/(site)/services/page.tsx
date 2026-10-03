import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { ALL_SERVICES_QUERY } from '@/sanity/lib/queries'
import SanityImage from '@/components/SanityImage'
import type { SanityImageValue } from '@/sanity/lib/image'
import { FadeIn, FadeUp } from '@/components/motion'
import { WHATSAPP_DISPLAY, whatsappLink } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Rent the GoTalk podcast studio in Kuching, or hire the crew — videography, drone, and video editing for businesses, creators, and brands in Sarawak.',
  openGraph: {
    title: 'Services',
    description:
      'Rent the GoTalk podcast studio in Kuching, or hire the crew — videography, drone, and video editing for businesses, creators, and brands in Sarawak.',
    url: 'https://gotalkstudios.com/services',
    type: 'website',
  },
  twitter: {
    title: 'Services',
    description:
      'Rent the GoTalk podcast studio in Kuching, or hire the crew — videography, drone, and video editing for businesses, creators, and brands in Sarawak.',
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PricingRow = {
  duration: string
  price: string
}

type Service = {
  _id: string
  name: string
  tagline: string | null
  image: SanityImageValue | null
  features: string[] | null
  perfectFor: string | null
  group: 'room' | 'crew' | null
  pricingRows: PricingRow[] | null
  pricingNote: string | null
}

// ─── Prices ───────────────────────────────────────────────────────────────────
//
// Prices are free text in Sanity and arrived in four spellings ("RM 180 - RM250",
// "RM350 - RM800", …). They are normalised here to one: "RM180–250".

function numbersIn(price: string): number[] {
  return [...price.matchAll(/\d[\d,]*/g)].map((m) => Number(m[0].replace(/,/g, '')))
}

function formatPrice(price: string): string {
  const [low, high] = numbersIn(price)
  if (low === undefined) return price.trim()
  const fmt = (n: number) => n.toLocaleString('en-MY')
  return high !== undefined && high !== low ? `RM${fmt(low)}–${fmt(high)}` : `RM${fmt(low)}`
}

/** The cheapest starting price across a service's rows, with the row it belongs to. */
function fromPrice(rows: PricingRow[]): { amount: string; per: string } | null {
  let best: { low: number; row: PricingRow } | null = null
  for (const row of rows) {
    const [low] = numbersIn(row.price)
    if (low !== undefined && (!best || low < best.low)) best = { low, row }
  }
  return best ? { amount: `RM${best.low.toLocaleString('en-MY')}`, per: best.row.duration } : null
}

/** "Hourly" → "hour", "Per Session" → "session", "1 Hour" → "1 hour". */
function perUnit(label: string): string {
  return label.trim().replace(/^per\s+/i, '').replace(/^hourly$/i, 'hour').toLowerCase()
}

/** Rentals sit under "Rent the room"; everything else is crew. */
function groupOf(s: Service): 'room' | 'crew' {
  return s.group ?? (/rental/i.test(s.name) ? 'room' : 'crew')
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

function PriceList({ service }: { service: Service }) {
  const rows = service.pricingRows ?? []
  if (rows.length === 0) return null
  return (
    <div>
      <table className="w-full text-sm">
        <caption className="sr-only">{service.name} rates</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Package</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.duration} className="border-b border-white/10 last:border-b-0">
              <th scope="row" className="py-3 pr-4 text-left font-normal text-white/70">
                {row.duration}
              </th>
              <td className="py-3 text-right font-semibold text-white tabular-nums whitespace-nowrap">
                {formatPrice(row.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-white/55 mt-3 leading-relaxed">
        {service.pricingNote ?? 'Final price depends on the job; we confirm it with you when you book.'}
      </p>
    </div>
  )
}

function FromPrice({ service }: { service: Service }) {
  const from = fromPrice(service.pricingRows ?? [])
  if (!from) return null
  return (
    <p className="flex items-baseline gap-2 flex-wrap">
      <span className="text-2xs font-bold tracking-label uppercase text-white/55">From</span>
      <span className="text-2xl font-semibold text-white leading-none tabular-nums">{from.amount}</span>
      <span className="text-sm text-white/55">/ {perUnit(from.per)}</span>
    </p>
  )
}

function Features({ items }: { items: string[] | null }) {
  if (!items || items.length === 0) return null
  return (
    <ul className="space-y-2.5">
      {items.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm text-white/80 leading-snug">
          <svg viewBox="0 0 16 16" className="w-4 h-4 mt-px shrink-0 text-white/40" aria-hidden="true">
            <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="square" />
          </svg>
          {/* As written, not forced into 12px tracked caps */}
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

function DownArrow() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-white/40" aria-hidden="true">
      <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="square" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"
      />
    </svg>
  )
}

/** One booking pattern everywhere: WhatsApp first, the form as the alternative. */
function BookActions({ service }: { service: Service }) {
  const wa = whatsappLink(`Hi GoTalk, I'd like to book ${service.name}. Is this date available: `)
  const form = `/contact?service=${encodeURIComponent(service.name)}#book`
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 bg-brand-red hover:bg-brand-red-hover active:scale-95 transition-all text-white text-2xs font-bold tracking-label uppercase px-6 min-h-[48px] text-center"
        >
          <WhatsAppIcon />
          Book on WhatsApp
        </a>
      ) : null}
      <Link
        href={form}
        className={
          wa
            ? 'inline-flex items-center min-h-[44px] text-sm text-white/70 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white transition-colors'
            : 'inline-flex items-center justify-center bg-brand-red hover:bg-brand-red-hover text-white text-2xs font-bold tracking-label uppercase px-6 min-h-[48px]'
        }
      >
        {wa ? 'or use the booking form' : 'Book now'}
      </Link>
    </div>
  )
}

// ─── Rent the room: two full cards ───────────────────────────────────────────

function RoomCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col h-full bg-surface-raised border border-white/10 overflow-hidden">
      {service.image?.asset && (
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-sunken">
          <SanityImage
            image={service.image}
            alt={`${service.name} at GoTalk Studios`}
            width={1100}
            sizes="(max-width: 1024px) 100vw, 50vw"
            useHotspot
          />
        </div>
      )}
      <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10">
        <h3 className="font-display text-4xl lg:text-5xl text-white tracking-wide leading-[0.95] mb-2">{service.name}</h3>
        {service.tagline && <p className="text-base text-white/70 mb-6">{service.tagline}</p>}
        <div className="mb-7">
          <FromPrice service={service} />
        </div>
        <div className="mb-7">
          <Features items={service.features} />
        </div>
        {service.perfectFor && (
          <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-[52ch]">
            <span className="text-white/85 font-semibold">Good for</span> {service.perfectFor.charAt(0).toLowerCase() + service.perfectFor.slice(1)}
          </p>
        )}
        <div className="mt-auto space-y-8">
          <PriceList service={service} />
          <BookActions service={service} />
        </div>
      </div>
    </article>
  )
}

// ─── Hire the crew: rows, not more boxes ─────────────────────────────────────

function CrewRow({ service }: { service: Service }) {
  return (
    <article className="grid lg:grid-cols-12 gap-x-10 gap-y-6 py-10 lg:py-12 border-t border-white/10">
      <div className="lg:col-span-5">
        <h3 className="font-display text-4xl text-white tracking-wide leading-none mb-3">{service.name}</h3>
        {service.tagline && <p className="text-base text-white/70 mb-3">{service.tagline}</p>}
        {service.perfectFor && (
          <p className="text-sm text-white/60 leading-relaxed max-w-[48ch] mb-5">
            <span className="text-white/85 font-semibold">Good for</span> {service.perfectFor.charAt(0).toLowerCase() + service.perfectFor.slice(1)}
          </p>
        )}
        <Features items={service.features} />
      </div>
      <div className="lg:col-span-4">
        <PriceList service={service} />
      </div>
      <div className="lg:col-span-3 flex flex-col gap-5 lg:items-start">
        <FromPrice service={service} />
        <BookActions service={service} />
      </div>
    </article>
  )
}

/** Same device as "On the Record" and "The Shows": display caps, last word in red. */
function GroupHeading({ id, lead, accent, children }: { id: string; lead: string; accent: string; children: ReactNode }) {
  return (
    <FadeUp>
      <div className="mb-10 lg:mb-14 pb-8 border-b border-white/10 flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <h2 id={id} className="font-display text-6xl lg:text-7xl text-white tracking-wide leading-[0.85]">
          {lead} <span className="text-brand-red">{accent}</span>
        </h2>
        <p className="text-base text-white/70 max-w-[44ch] lg:text-right">{children}</p>
      </div>
    </FadeUp>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
//
// Was a template: an outlined "SERVICES" headline under a "What We Offer" chip,
// two full-bleed numbered cards off the page grid, three boxed "additional"
// services, red-tinted "Perfect For" callouts, and a solid red closing band —
// red spent about a dozen ways. The page now says what it actually sells, in
// the two ways people buy it: the room, or the crew. Red is the booking button.

export default async function ServicesPage() {
  const { data } = await sanityFetch({ query: ALL_SERVICES_QUERY })
  const services = (data ?? []) as Service[]

  const room = services.filter((s) => groupOf(s) === 'room')
  const crew = services.filter((s) => groupOf(s) === 'crew')
  const generalWa = whatsappLink("Hi GoTalk, I'd like to ask about booking the studio.")

  return (
    <main id="main" tabIndex={-1} className="pt-16 bg-surface-base min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-surface-sunken border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 section-y-tight">
          <FadeUp>
            <h1
              className="font-display uppercase text-white leading-[0.9] tracking-wide mb-6"
              style={{ fontSize: 'clamp(3.25rem, 8vw, 6rem)' }}
            >
              Rent the room.
              <span className="block text-white/45">Hire the crew.</span>
            </h1>
          </FadeUp>
          <FadeIn delay={0.15}>
            <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-[60ch] mb-8">
              The studio GoTalk is recorded in, open to businesses, creators, and brands in
              Sarawak — with the gear and the operators to go with it.
            </p>
            <nav aria-label="Services" className="flex flex-wrap gap-x-8 gap-y-2">
              {room.length > 0 && (
                <a href="#room" className="inline-flex items-center gap-2 min-h-[44px] text-2xs font-bold tracking-label uppercase text-white/70 hover:text-white transition-colors">
                  Studio rental <DownArrow />
                </a>
              )}
              {crew.length > 0 && (
                <a href="#crew" className="inline-flex items-center gap-2 min-h-[44px] text-2xs font-bold tracking-label uppercase text-white/70 hover:text-white transition-colors">
                  Production services <DownArrow />
                </a>
              )}
            </nav>
          </FadeIn>
        </div>
      </section>

      {services.length === 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 section-y-tight">
          <p className="text-white/70 max-w-[60ch]">
            Our service list is being updated.{' '}
            {generalWa ? (
              <a href={generalWa} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">
                Message us on WhatsApp
              </a>
            ) : (
              <Link href="/contact#book" className="text-white underline underline-offset-4">Get in touch</Link>
            )}{' '}
            and we&apos;ll tell you what&apos;s available.
          </p>
        </section>
      )}

      {/* ── Rent the room ────────────────────────────────────── */}
      {room.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 section-y-tight scroll-mt-16" id="room" aria-labelledby="room-heading">
          <GroupHeading id="room-heading" lead="Rent the" accent="room">
            Book the GoTalk set for your own podcast, shoot, or livestream.
          </GroupHeading>
          <div className={`grid gap-4 ${room.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {room.map((service, i) => (
              <FadeUp key={service._id} delay={i * 0.08} className="h-full">
                <RoomCard service={service} />
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      {/* ── Hire the crew ────────────────────────────────────── */}
      {crew.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 section-y-tight scroll-mt-16" id="crew" aria-labelledby="crew-heading">
          <GroupHeading id="crew-heading" lead="Hire the" accent="crew">
            Our team films, flies, and edits for you, at the studio or on location.
          </GroupHeading>
          {/* The heading's rule already opens the list, so the first row drops its own. */}
          <div className="border-b border-white/10 [&>*:first-child_article]:border-t-0 [&>*:first-child_article]:pt-0">
            {crew.map((service) => (
              <FadeUp key={service._id}>
                <CrewRow service={service} />
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      {/* ── Close ────────────────────────────────────────────── */}
      <section className="bg-surface-sunken border-t border-white/5 section-y">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-6">
            <h2 className="font-display text-white uppercase leading-[0.9] tracking-wide mb-4 text-5xl lg:text-6xl">
              Ready to book?
            </h2>
            <p className="text-white/70 text-base max-w-[55ch]">
              Tell us the service and the date. We&apos;ll check availability and confirm the price with you.
            </p>
          </div>
          <div className="lg:col-span-6 flex flex-col sm:flex-row lg:justify-end items-stretch sm:items-center gap-3">
            {generalWa && (
              <a
                href={generalWa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-brand-red hover:bg-brand-red-hover active:scale-95 transition-all text-white text-2xs font-bold tracking-label uppercase whitespace-nowrap px-7 min-h-[52px]"
              >
                <WhatsAppIcon />
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            )}
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center border border-white/25 hover:border-white hover:bg-white/5 active:scale-95 transition-all text-white text-2xs font-bold tracking-label uppercase whitespace-nowrap px-7 min-h-[52px]"
            >
              Booking form
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
