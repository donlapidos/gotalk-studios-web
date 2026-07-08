import Image from 'next/image'
import SanityImage from '@/components/SanityImage'
import Watermark from './Watermark'
import { extractYouTubeId } from '@/lib/youtube'
import type { GalleryItem, GallerySettings } from './types'

type Props = {
  item: GalleryItem
  selected: boolean
  settings: GallerySettings
  onOpen: () => void
  onToggle: () => void
}

export default function GalleryCard({ item, selected, settings, onOpen, onToggle }: Props) {
  const isPhoto = item.mediaType === 'photo'
  const videoId = extractYouTubeId(item.youtubeUrl)

  return (
    <div className={`flex flex-col border border-[#222] bg-[#1C1B1B] ${isPhoto ? '' : 'sm:col-span-2'}`}>
      {/* Media */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${item.title}`}
        className={`relative w-full overflow-hidden bg-[#232221] cursor-pointer text-left ${isPhoto ? 'aspect-[4/5]' : 'aspect-video'}`}
      >
        {isPhoto && item.image?.asset ? (
          <SanityImage
            image={item.image}
            alt={item.title}
            width={640}
            height={800}
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : videoId ? (
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 66vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#232221] to-[#CC0000]/10" />
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(14,14,14,0.55), transparent 40%)' }}
        />

        {isPhoto && <Watermark text={settings.watermarkText} style={settings.watermarkStyle} />}

        {item.collection?.badge && (
          <span className="absolute top-3 left-3 pointer-events-none font-[family-name:var(--font-bebas-neue)] text-sm tracking-[0.1em] text-[#131313] bg-[#E5E2E1] px-2 py-0.5">
            {item.collection.badge}
          </span>
        )}

        {!isPhoto && (
          <>
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-0 h-0 border-t-[16px] border-b-[16px] border-l-[26px] border-transparent border-l-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" />
            </span>
            {item.duration && (
              <span className="absolute bottom-3 right-3 pointer-events-none text-[11px] font-semibold tracking-[0.1em] text-white bg-[#0E0E0E]/75 px-2 py-0.5">
                {item.duration}
              </span>
            )}
          </>
        )}
      </button>

      {/* Info bar */}
      <div
        onClick={onOpen}
        className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-[0.05em] uppercase text-[#E5E2E1] truncate">
            {item.title}
          </span>
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/40 truncate">
            {item.collection?.name}
            {isPhoto ? ` · RM ${settings.singlePrice}` : ''}
          </span>
        </div>
        {isPhoto ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className={`shrink-0 text-[10px] font-bold tracking-[0.2em] uppercase px-3.5 py-2.5 transition-all ${
              selected
                ? 'bg-[#CC0000] text-white outline outline-1 -outline-offset-1 outline-[#CC0000]'
                : 'bg-transparent text-[#E5E2E1] outline outline-1 -outline-offset-1 outline-white/25 hover:outline-white'
            }`}
          >
            {selected ? 'SELECTED ✓' : 'SELECT'}
          </button>
        ) : (
          <span className="shrink-0 text-[11px] font-bold tracking-[0.2em] uppercase text-[#CC0000] whitespace-nowrap">
            WATCH →
          </span>
        )}
      </div>
    </div>
  )
}
