import Image from 'next/image'
import { imageUrl, hotspotPosition, type SanityImageValue } from '@/sanity/lib/image'

type Props = {
  image: SanityImageValue | null | undefined
  /** Fallback alt text when the editor hasn't set one on the image itself. */
  alt: string
  /** Dimensions the Sanity CDN crops to — pick roughly 2× the rendered size. */
  width: number
  height: number
  sizes: string
  className?: string
  priority?: boolean
  /** Position the visible area from the Studio hotspot (profile/portrait shots). */
  useHotspot?: boolean
}

/**
 * Standard renderer for Sanity images: fills its (relatively positioned)
 * parent, crops via the Sanity CDN, uses editor-provided alt text when
 * available, and blurs up from the asset's LQIP when the query projects it.
 */
export default function SanityImage({
  image,
  alt,
  width,
  height,
  sizes,
  className = '',
  priority = false,
  useHotspot = false,
}: Props) {
  const src = imageUrl(image, width, height)
  if (!src) return null

  return (
    <Image
      src={src}
      alt={image?.alt || alt}
      fill
      priority={priority}
      className={`object-cover ${className}`.trim()}
      style={useHotspot ? { objectPosition: hotspotPosition(image) } : undefined}
      sizes={sizes}
      placeholder={image?.lqip ? 'blur' : 'empty'}
      blurDataURL={image?.lqip ?? undefined}
    />
  )
}
