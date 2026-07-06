import type { Metadata } from 'next'
import Link from 'next/link'
import GuestsDirectory, { type GuestItem } from '@/components/GuestsDirectory'
import { sanityFetch } from '@/sanity/lib/live'
import { ALL_GUESTS_QUERY } from '@/sanity/lib/queries'
import { FadeUp, FadeIn, DrawLine } from '@/components/motion'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Guests | GoTalk Studios',
  description:
    "Meet the voices of Sarawak — the entrepreneurs, leaders, and icons who've joined GoTalk Studios for honest conversations.",
  openGraph: {
    title: 'Guests | GoTalk Studios',
    description:
      "Meet the voices of Sarawak — the entrepreneurs, leaders, and icons who've joined GoTalk Studios for honest conversations.",
    url: 'https://gotalkstudios.com/guests',
    type: 'website',
  },
  twitter: {
    title: 'Guests | GoTalk Studios',
    description:
      "Meet the voices of Sarawak — the entrepreneurs, leaders, and icons who've joined GoTalk Studios for honest conversations.",
  },
}

export default async function GuestsPage() {
  const { data } = await sanityFetch({ query: ALL_GUESTS_QUERY })
  const guests = (data ?? []) as GuestItem[]

  return (
    <>
      <main className="pt-16 bg-[#111111] min-h-screen">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="relative bg-[#0D0D0D] border-b border-white/5 overflow-hidden">
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
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-[2px] bg-[#CC0000] inline-block" />
                <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.35em] uppercase">
                  Broadcast Directory
                </span>
              </div>
            </FadeIn>

            <FadeUp delay={0.15}>
              <h1
                className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none"
                style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', letterSpacing: '0.02em' }}
              >
                Guests
              </h1>
            </FadeUp>

            <FadeIn delay={0.3}>
              <DrawLine delay={0.35} className="w-16 h-[2px] bg-[#CC0000] mt-4 mb-4" />
              <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase">
                Meet the Voices of Sarawak
              </p>
            </FadeIn>
          </div>
        </div>

        {/* ── Directory ───────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <GuestsDirectory guests={guests} />
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <section className="bg-[#CC0000] py-20 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-5"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '0.03em' }}
            >
              Have a Story to Tell?
            </h2>
            <p className="text-white/80 text-sm font-bold tracking-[0.2em] uppercase mb-8">
              We are always looking for innovators, leaders, and visionaries to join the conversation.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-[#CC0000] text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#F0F0EE] active:scale-95 transition-all"
            >
              Nominate a Guest
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
