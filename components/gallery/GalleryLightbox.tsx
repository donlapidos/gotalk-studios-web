import { useEffect } from 'react'
import SanityImage from '@/components/SanityImage'
import Watermark from './Watermark'
import { imageAspect } from '@/sanity/lib/image'
import { extractYouTubeId } from '@/lib/youtube'
import type { GalleryItem, GallerySettings } from './types'

type Props = {
  item: GalleryItem
  selected: boolean
  settings: GallerySettings
  packsLine: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onToggle: () => void
}

export default function GalleryLightbox({
  item,
  selected,
  settings,
  packsLine,
  onClose,
  onPrev,
  onNext,
  onToggle,
}: Props) {
  const isPhoto = item.mediaType === 'photo'
  const videoId = extractYouTubeId(item.youtubeUrl)
  // Size the pane to the photo's real shape so nothing gets cropped away
  const photoAspect = isPhoto ? (imageAspect(item.image) ?? 4 / 5) : null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNext, onPrev])

  return (
    <div
      className="fixed inset-0 z-[70] bg-surface-sunken/[0.92] backdrop-blur-md flex items-center justify-center p-4 sm:p-12"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-6 sm:top-6 sm:right-8 text-white/60 hover:text-white text-2xl leading-none p-2 z-10"
      >
        ✕
      </button>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white font-display text-4xl p-3 z-10"
      >
        ←
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white font-display text-4xl p-3 z-10"
      >
        →
      </button>

      <div className="flex flex-col lg:flex-row gap-1 max-w-5xl w-full max-h-[85vh] shadow-[0_24px_48px_rgba(0,0,0,0.5)] overflow-auto lg:overflow-visible">
        {/* Media pane */}
        <div
          className={`gallery-protect relative lg:flex-[1.6] bg-surface-raised overflow-hidden min-w-0 shrink-0 ${
            isPhoto ? 'max-h-[60vh] lg:max-h-none' : 'aspect-video'
          }`}
          style={photoAspect ? { aspectRatio: String(photoAspect) } : undefined}
          onContextMenu={(e) => e.preventDefault()}
        >
          {isPhoto && item.image?.asset ? (
            <>
              <SanityImage
                image={item.image}
                alt={item.title}
                width={1600}
                fit="contain"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <Watermark text={settings.watermarkText} style={settings.watermarkStyle} size="lightbox" />
            </>
          ) : videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/55 text-xs tracking-widest uppercase">No media available</span>
            </div>
          )}
        </div>

        {/* Info pane */}
        <div className="lg:flex-1 bg-surface-overlay p-7 lg:p-9 flex flex-col gap-4 overflow-auto">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[2px] bg-brand-red inline-block" />
            <span className="text-accent text-2xs font-bold tracking-label uppercase">
              {item.collection?.name ?? 'GoTalk Studios'}
            </span>
          </div>
          <h2 className="font-display text-4xl leading-[0.95] tracking-[0.025em] uppercase text-surface-light-alt">
            {item.title}
          </h2>
          <span className="text-2xs font-semibold tracking-label uppercase text-white/55">
            {item.collection?.badge}
            {item.duration ? ` · ${item.duration}` : ''}
          </span>
          {item.description && (
            <p className="text-sm leading-relaxed text-white/60">{item.description}</p>
          )}

          <div className="mt-auto flex flex-col gap-4 pt-4">
            {isPhoto ? (
              <>
                <div className="bg-surface-overlay px-5 py-4 flex items-baseline justify-between">
                  <span className="text-2xs font-bold tracking-label uppercase text-white/45">Single Frame</span>
                  <span className="font-display text-3xl text-surface-light-alt">
                    RM {settings.singlePrice}
                  </span>
                </div>
                <span className="text-2xs tracking-wide uppercase text-white/55">{packsLine}</span>
                <button
                  type="button"
                  onClick={onToggle}
                  className={`text-xs font-bold tracking-label uppercase px-7 py-4 transition-all ${
                    selected
                      ? 'bg-transparent text-white outline outline-1 -outline-offset-1 outline-white/35'
                      : 'bg-brand-red text-white hover:bg-brand-red-hover'
                  }`}
                >
                  {selected ? 'REMOVE FROM SELECTION' : 'ADD TO SELECTION →'}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
