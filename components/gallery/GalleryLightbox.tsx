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
      className="fixed inset-0 z-[70] bg-[#0E0E0E]/[0.92] backdrop-blur-md flex items-center justify-center p-4 sm:p-12"
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
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white font-[family-name:var(--font-bebas-neue)] text-4xl p-3 z-10"
      >
        ←
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white font-[family-name:var(--font-bebas-neue)] text-4xl p-3 z-10"
      >
        →
      </button>

      <div className="flex flex-col lg:flex-row gap-1 max-w-5xl w-full max-h-[85vh] shadow-[0_24px_48px_rgba(0,0,0,0.5)] overflow-auto lg:overflow-visible">
        {/* Media pane */}
        <div
          className={`gallery-protect relative lg:flex-[1.6] bg-[#1C1B1B] overflow-hidden min-w-0 shrink-0 ${
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
              <span className="text-white/20 text-xs tracking-widest uppercase">No media available</span>
            </div>
          )}
        </div>

        {/* Info pane */}
        <div className="lg:flex-1 bg-[#232221] p-7 lg:p-9 flex flex-col gap-4 overflow-auto">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#CC0000] inline-block" />
            <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.3em] uppercase">
              {item.collection?.name ?? 'GoTalk Studios'}
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl leading-[0.95] tracking-[0.025em] uppercase text-[#E5E2E1]">
            {item.title}
          </h2>
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/40">
            {item.collection?.badge}
            {item.duration ? ` · ${item.duration}` : ''}
          </span>
          {item.description && (
            <p className="text-sm leading-relaxed text-white/60">{item.description}</p>
          )}

          <div className="mt-auto flex flex-col gap-4 pt-4">
            {isPhoto ? (
              <>
                <div className="bg-[#2A2A2A] px-5 py-4 flex items-baseline justify-between">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/45">Single Frame</span>
                  <span className="font-[family-name:var(--font-bebas-neue)] text-3xl text-[#E5E2E1]">
                    RM {settings.singlePrice}
                  </span>
                </div>
                <span className="text-[11px] tracking-[0.1em] uppercase text-white/40">{packsLine}</span>
                <button
                  type="button"
                  onClick={onToggle}
                  className={`text-xs font-bold tracking-[0.2em] uppercase px-7 py-4 transition-all ${
                    selected
                      ? 'bg-transparent text-white outline outline-1 -outline-offset-1 outline-white/35'
                      : 'bg-[#CC0000] text-white hover:bg-[#AA0000]'
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
