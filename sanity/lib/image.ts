import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

/**
 * Shape of image fields as returned by our GROQ projections
 * (e.g. `photo{ ..., "lqip": asset->metadata.lqip }`).
 */
export type SanityImageValue = {
  asset?: { _ref: string } | null
  hotspot?: { x: number; y: number } | null
  crop?: { top: number; bottom: number; left: number; right: number } | null
  alt?: string | null
  lqip?: string | null
}

/**
 * Safe URL builder — returns null when the image is missing or malformed
 * instead of throwing. Crops around the Studio hotspot when both dimensions
 * are given.
 */
export function imageUrl(image: unknown, width: number, height?: number): string | null {
  if (!image || typeof image !== 'object') return null
  if (!('asset' in image) || !(image as SanityImageValue).asset) return null
  try {
    let b = urlFor(image as SanityImageSource).width(width).auto('format')
    if (height) b = b.height(height).fit('crop')
    return b.url()
  } catch {
    return null
  }
}

/**
 * Intrinsic aspect ratio (width/height) of a Sanity image, read from the
 * dimensions encoded in the asset _ref, adjusted for any Studio crop rect.
 * Returns null when the ref is missing or malformed.
 */
export function imageAspect(image: unknown): number | null {
  const value = image as SanityImageValue | null | undefined
  const m = value?.asset?._ref?.match(/-(\d+)x(\d+)-/)
  if (!m) return null
  const w = Number(m[1])
  const h = Number(m[2])
  if (!w || !h) return null
  const crop = value?.crop
  if (crop) {
    const cw = w * (1 - crop.left - crop.right)
    const ch = h * (1 - crop.top - crop.bottom)
    if (cw > 0 && ch > 0) return cw / ch
  }
  return w / h
}

/**
 * CSS object-position derived from the Studio hotspot, for images rendered
 * at a different aspect ratio than they were cropped to. Defaults to a
 * portrait-friendly position (faces sit in the upper part of the frame).
 */
export function hotspotPosition(image: unknown, fallback = 'center 15%'): string {
  if (image && typeof image === 'object' && 'hotspot' in image) {
    const h = (image as SanityImageValue).hotspot
    if (h && typeof h.x === 'number' && typeof h.y === 'number') {
      return `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%`
    }
  }
  return fallback
}
