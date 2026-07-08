import type { SanityImageValue } from '@/sanity/lib/image'
import type { GalleryPack } from '@/lib/gallery'

export type GalleryCollection = { _id: string; name: string; badge: string }

export type GalleryMediaType = 'photo' | 'video' | 'film'

export type GalleryItem = {
  _id: string
  title: string
  mediaType: GalleryMediaType
  image: SanityImageValue | null
  youtubeUrl: string | null
  duration: string | null
  description: string | null
  collection: GalleryCollection | null
}

export type WatermarkStyle = 'corner' | 'diagonal' | 'centered'

export type GallerySettings = {
  singlePrice: number
  packs: GalleryPack[]
  watermarkText: string
  watermarkStyle: WatermarkStyle
}

export const DEFAULT_GALLERY_SETTINGS: GallerySettings = {
  singlePrice: 10,
  packs: [
    { qty: 3, price: 25 },
    { qty: 5, price: 40 },
    { qty: 10, price: 70 },
  ],
  watermarkText: '© GOTALK STUDIOS',
  watermarkStyle: 'corner',
}
