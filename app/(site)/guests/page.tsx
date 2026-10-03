import type { Metadata } from 'next'
import Link from 'next/link'
import GuestsDirectory, { type GuestItem } from '@/components/GuestsDirectory'
import { sanityFetch } from '@/sanity/lib/live'
import { ALL_GUESTS_QUERY } from '@/sanity/lib/queries'
import { FadeUp, FadeIn, DrawLine } from '@/components/motion'

export const metadata: Metadata = {
  title: 'Guests',
  description:
    "Meet the voices of Sarawak — the entrepreneurs, leaders, and icons who've joined GoTalk Studios for honest conversations.",
  openGraph: {
    title: 'Guests',
    description:
      "Meet the voices of Sarawak — the entrepreneurs, leaders, and icons who've joined GoTalk Studios for honest conversations.",
    url: 'https://gotalkstudios.com/guests',
    type: 'website',
  },
  twitter: {
    title: 'Guests',
    description:
      "Meet the voices of Sarawak — the entrepreneurs, leaders, and icons who've joined GoTalk Studios for honest conversations.",
  },
}

export default async function GuestsPage() {
  const { data } = await sanityFetch({ query: ALL_GUESTS_QUERY })
  const guests = (data ?? []) as GuestItem[]

  return (
    <>
      <main id="main" tabIndex={-1} className="pt-16 bg-surface-base min-h-screen">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="relative bg-surface-sunken border-b border-white/5 overflow-hidden">
          {/* Red glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 50% 80% at 0% 100%, rgba(204,0,0,0.12) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">

            <FadeIn delay={0.05}>
              <p className="section-label mb-6">Broadcast Directory</p>
            </FadeIn>

            <FadeUp delay={0.15}>
              <h1
                className="font-display text-white uppercase leading-none"
                style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', letterSpacing: '0.02em' }}
              >
                Guests
              </h1>
            </FadeUp>

            <FadeIn delay={0.3}>
              <DrawLine delay={0.35} className="w-16 h-[2px] bg-brand-red mt-4 mb-4" />
              <p className="text-white/70 text-xs font-bold tracking-label uppercase">
                Meet the Voices of Sarawak
              </p>
            </FadeIn>
          </div>
        </div>

        {/* ── Directory ───────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 section-y-tight">
          {/* The 23 guest cards are h3s, and there was no h2 between them and the
              page h1 — the only level skip left on the site. */}
          <h2 className="font-display text-white uppercase text-3xl tracking-wide mb-8">
            The Directory
          </h2>
          <GuestsDirectory guests={guests} />
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <section className="bg-brand-red py-20 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-display text-white uppercase leading-none mb-5"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '0.03em' }}
            >
              Have a Story to Tell?
            </h2>
            <p className="text-white text-sm font-bold tracking-label uppercase mb-8">
              We are always looking for innovators, leaders, and visionaries to join the conversation.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-brand-red text-xs font-bold tracking-label uppercase px-8 py-4 hover:bg-surface-light active:scale-95 transition-all"
            >
              Nominate a Guest
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
