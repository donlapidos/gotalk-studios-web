import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { GALLERY_PAGE_QUERY } from '@/sanity/lib/queries'
import UploadClient from '@/components/upload/UploadClient'
import { DEFAULT_GALLERY_SETTINGS, type GalleryCollection } from '@/components/gallery/types'
import { FadeIn, FadeUp } from '@/components/motion'

// Team-only page — reachable by URL + shared password, never indexed or linked
export const metadata: Metadata = {
  title: 'Team Upload',
  robots: { index: false, follow: false },
}

export default async function UploadPage() {
  const { data } = await sanityFetch({ query: GALLERY_PAGE_QUERY })
  const collections = (data?.collections ?? []) as GalleryCollection[]
  const watermarkText = data?.settings?.watermarkText ?? DEFAULT_GALLERY_SETTINGS.watermarkText

  return (
    <main id="main" tabIndex={-1} className="pt-16 bg-surface-base min-h-screen">
      <div className="relative bg-surface-base border-b border-white/10 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <FadeUp delay={0.15}>
            <h1 className="font-display text-5xl lg:text-7xl text-white tracking-wide mb-3">
              Gallery Upload
            </h1>
          </FadeUp>
          <FadeIn delay={0.25}>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed">
              Pick the event, drop in the photos straight off the card or Drive, hit upload.
              Watermarking, resizing, and publishing happen automatically.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <UploadClient collections={collections} watermarkText={watermarkText} />
      </div>
    </main>
  )
}
