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
import { FadeUp, LineRevealScroll } from '@/components/motion'

export const metadata: Metadata = {
  title:       'Gallery',
  description: 'Photos and films from the field across Sarawak — browse the GoTalk Studios archive and take the frames you want home.',
  openGraph: {
    title:       'Gallery',
    description: 'Photos and films from the field across Sarawak — browse the GoTalk Studios archive and take the frames you want home.',
    url:         'https://gotalkstudios.com/gallery',
    type:        'website',
  },
  twitter: {
    title:       'Gallery',
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
  // Photos without an uploaded image can't be displayed or sold — drop them.
  // Untitled photos fall back to the uploaded file's name (sans extension),
  // which is also what order fulfilment matches against in Drive.
  type RawItem = Omit<GalleryItem, 'title'> & {
    title: string | null
    originalFilename: string | null
  }
  const items: GalleryItem[] = ((data?.items ?? []) as RawItem[])
    .filter((it) => it.mediaType !== 'photo' || it.image?.asset)
    .map(({ originalFilename, ...it }) => ({
      ...it,
      title: it.title ?? originalFilename?.replace(/\.[^.]+$/, '') ?? 'Untitled',
    }))

  // Sorted ascending by quantity. Sanity returns packs in document order, which
  // rendered the ladder as 1 / 5 / 3 — so the bundle logic was unreadable and the
  // "Save" figures appeared to shrink as you moved right. The per-frame unit price
  // is shown on each tier so the saving needs no arithmetic, and the largest pack
  // is flagged rather than left for the reader to work out.
  const packs = [...settings.packs].sort((a, b) => a.qty - b.qty)
  const unit = (price: number, qty: number) =>
    `RM ${(price / qty).toFixed(2).replace(/\.00$/, '')} each`

  const tiers = [
    {
      label: '1 Frame',
      qty: 1,
      price: settings.singlePrice,
      note: 'Single download',
      unit: unit(settings.singlePrice, 1),
      best: false,
    },
    ...packs.map((p, i) => ({
      label: `${p.qty} Frames`,
      qty: p.qty,
      price: p.price,
      note: `Save RM ${p.qty * settings.singlePrice - p.price}`,
      unit: unit(p.price, p.qty),
      best: i === packs.length - 1,
    })),
  ]

  return (
    <main id="main" tabIndex={-1} className="pt-16 bg-surface-base min-h-screen">
      {/* Hero */}
      <div className="relative bg-surface-base border-b border-white/10 overflow-hidden noise">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* The giant "GALLERY" watermark that sat here was clipped mid-glyph by
            the viewport's right edge and sat underneath the body copy, so the
            paragraph read on top of ghost letterforms. */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 section-y-tight">
          <LineRevealScroll>
            <h1 className="font-display text-5xl lg:text-7xl text-white tracking-wide mb-4">
              Beyond the <span className="text-brand-red">Studio.</span>
            </h1>
          </LineRevealScroll>
          <FadeUp delay={0.2}>
            <p className="text-white/70 text-lg max-w-[62ch] leading-relaxed">
              The events we cover, the projects we shoot, the streets we walk — photos and films
              made outside the stage, across Sarawak. Browse the archive and take the frames you
              want home.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-white/70 text-xs tracking-wide uppercase mt-5">
              Watermarked previews — full-resolution files unlock on purchase.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-surface-base py-14 pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <GalleryClient items={items} collections={collections} settings={settings} />
        </div>
      </div>

      {/* Pricing */}
      <section className="bg-surface-alt border-t border-white/10 section-y">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <LineRevealScroll>
            <p className="section-label mb-5">Licensing</p>
            <h2 className="font-display text-5xl lg:text-6xl text-white tracking-wide">
              Take the Frames Home.
            </h2>
          </LineRevealScroll>
          <FadeUp delay={0.15}>
            <p className="text-white/70 text-base leading-relaxed max-w-[60ch] mt-5 mb-12">
              Every purchase includes the full-resolution file — watermark-free, delivered by
              download link once payment clears.
            </p>
          </FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {tiers.map((tier) => (
              <FadeUp key={tier.label}>
                <div
                  className={`px-7 py-8 flex flex-col gap-2 h-full relative ${
                    tier.best
                      ? 'bg-surface-overlay border border-brand-red'
                      : 'bg-surface-overlay border border-transparent'
                  }`}
                >
                  {tier.best && (
                    <span className="absolute -top-px right-0 bg-brand-red text-white text-2xs font-bold tracking-label uppercase px-2.5 py-1">
                      Best value
                    </span>
                  )}
                  <span className="text-2xs font-bold tracking-label uppercase text-white/70">
                    {tier.label}
                  </span>
                  <span className="font-display text-5xl leading-none text-surface-light-alt">
                    RM {tier.price}
                  </span>
                  <span className="text-2xs text-white/70 tabular-nums">{tier.unit}</span>
                  <span className="text-2xs font-semibold tracking-wide uppercase text-accent mt-auto">
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
