import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { GALLERY_PAGE_QUERY } from '@/sanity/lib/queries'
import GalleryClient from '@/components/gallery/GalleryClient'
import {
  DEFAULT_GALLERY_SETTINGS,
  type GalleryCollection,
  type GalleryItem,
  type GallerySettings,
  type WatermarkStyle,
} from '@/components/gallery/types'
import { FadeIn, FadeUp, DrawLine, LineRevealScroll } from '@/components/motion'

export const metadata: Metadata = {
  title:       'Gallery | GoTalk Studios',
  description: 'Photos and films from the field across Sarawak — browse the GoTalk Studios archive and take the frames you want home.',
  openGraph: {
    title:       'Gallery | GoTalk Studios',
    description: 'Photos and films from the field across Sarawak — browse the GoTalk Studios archive and take the frames you want home.',
    url:         'https://gotalkstudios.com/gallery',
    type:        'website',
  },
  twitter: {
    title:       'Gallery | GoTalk Studios',
    description: 'Photos and films from the field across Sarawak — browse the GoTalk Studios archive and take the frames you want home.',
  },
}

export default async function GalleryPage() {
  const { data } = await sanityFetch({ query: GALLERY_PAGE_QUERY })

  const s = data?.settings
  const settings: GallerySettings = {
    singlePrice: s?.singlePrice ?? DEFAULT_GALLERY_SETTINGS.singlePrice,
    packs: s?.packs?.length ? s.packs : DEFAULT_GALLERY_SETTINGS.packs,
    watermarkText: s?.watermarkText ?? DEFAULT_GALLERY_SETTINGS.watermarkText,
    watermarkStyle: (s?.watermarkStyle as WatermarkStyle) ?? DEFAULT_GALLERY_SETTINGS.watermarkStyle,
  }
  const collections = (data?.collections ?? []) as GalleryCollection[]
  // Photos without an uploaded image can't be displayed or sold — drop them
  const items = ((data?.items ?? []) as GalleryItem[]).filter(
    (it) => it.mediaType !== 'photo' || it.image?.asset
  )

  const tiers = [
    { label: '1 Frame', price: settings.singlePrice, note: 'Single download' },
    ...settings.packs.map((p) => ({
      label: `${p.qty} Frames`,
      price: p.price,
      note: `Save RM ${p.qty * settings.singlePrice - p.price}`,
    })),
  ]

  return (
    <main className="pt-16 bg-[#111111] min-h-screen">
      {/* Hero */}
      <div className="relative bg-[#111111] border-b border-white/10 overflow-hidden noise">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC0000]" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div
          className="absolute -right-[2%] -bottom-[6%] font-[family-name:var(--font-bebas-neue)] leading-[0.8] uppercase pointer-events-none select-none text-white/[0.025]"
          style={{ fontSize: '22vw' }}
          aria-hidden="true"
        >
          GALLERY
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <FadeIn delay={0.1}>
            <div className="flex items-center gap-3 mb-3">
              <DrawLine delay={0.2} className="w-8 h-px bg-[#CC0000]" />
              <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                In the Field
              </span>
            </div>
          </FadeIn>
          <LineRevealScroll>
            <h1 className="font-[family-name:var(--font-bebas-neue)] text-6xl lg:text-8xl text-white tracking-wide mb-4">
              Beyond the <span className="text-[#CC0000]">Studio.</span>
            </h1>
          </LineRevealScroll>
          <FadeUp delay={0.2}>
            <p className="text-white/65 text-lg max-w-xl leading-relaxed">
              The events we cover, the projects we shoot, the streets we walk — photos and films
              made outside the stage, across Sarawak. Browse the archive and take the frames you
              want home.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-white/40 text-xs tracking-[0.15em] uppercase mt-5">
              Watermarked previews — full-resolution files unlock on purchase.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-[#111111] py-14 pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <GalleryClient items={items} collections={collections} settings={settings} />
        </div>
      </div>

      {/* Pricing */}
      <section className="bg-[#161616] border-t border-white/10 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <DrawLine className="w-8 h-px bg-[#CC0000]" />
              <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                Licensing
              </span>
            </div>
          </FadeIn>
          <LineRevealScroll>
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-5xl lg:text-7xl text-white tracking-wide">
              Take the Frames Home.
            </h2>
          </LineRevealScroll>
          <FadeUp delay={0.15}>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-lg mt-5 mb-12">
              Every purchase includes the full-resolution file — watermark-free, delivered by
              download link once payment clears.
            </p>
          </FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {tiers.map((tier) => (
              <FadeUp key={tier.label}>
                <div className="bg-[#232221] px-7 py-8 flex flex-col gap-2 h-full">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/45">
                    {tier.label}
                  </span>
                  <span className="font-[family-name:var(--font-bebas-neue)] text-[44px] leading-none text-[#E5E2E1]">
                    RM {tier.price}
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#CC0000]">
                    {tier.note}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
