'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { computeTotal, computeSavings } from '@/lib/gallery'
import GalleryCard from './GalleryCard'
import GalleryLightbox from './GalleryLightbox'
import SelectionTray from './SelectionTray'
import CheckoutModal from './CheckoutModal'
import type { GalleryCollection, GalleryItem, GallerySettings } from './types'

const TABS = [
  { key: 'all', label: 'ALL WORK' },
  { key: 'photo', label: 'PHOTOS' },
  { key: 'video', label: 'VIDEOS' },
  { key: 'film', label: 'SHORT FILMS' },
] as const

type TabKey = (typeof TABS)[number]['key']

type Props = {
  items: GalleryItem[]
  collections: GalleryCollection[]
  settings: GallerySettings
}

export default function GalleryClient({ items, collections, settings }: Props) {
  const [tab, setTab] = useState<TabKey>('all')
  const [collectionId, setCollectionId] = useState<string>('all')
  const [selected, setSelected] = useState<string[]>([])
  const [lightboxId, setLightboxId] = useState<string | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        const typeOk = tab === 'all' || it.mediaType === tab
        const colOk = collectionId === 'all' || it.collection?._id === collectionId
        return typeOk && colOk
      }),
    [items, tab, collectionId]
  )

  const counts = useMemo(
    () => ({
      photo: items.filter((i) => i.mediaType === 'photo').length,
      video: items.filter((i) => i.mediaType === 'video').length,
      film: items.filter((i) => i.mediaType === 'film').length,
    }),
    [items]
  )

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const step = (dir: 1 | -1) => {
    setLightboxId((current) => {
      if (!current) return current
      const i = filtered.findIndex((it) => it._id === current)
      if (i < 0) return current
      return filtered[(i + dir + filtered.length) % filtered.length]._id
    })
  }

  const total = computeTotal(selected.length, settings.singlePrice, settings.packs)
  const savings = computeSavings(selected.length, settings.singlePrice, settings.packs)
  const packsLine =
    settings.packs.length > 0
      ? `Sets — ${settings.packs.map((p) => `${p.qty} / RM${p.price}`).join(' · ')}`
      : ''

  const lightboxItem = lightboxId
    ? (filtered.find((it) => it._id === lightboxId) ??
      items.find((it) => it._id === lightboxId) ??
      null)
    : null
  const selectedItems = items.filter((it) => selected.includes(it._id))

  return (
    <div>
      {/* Type tabs + count */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-5">
        <div className="flex gap-1 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`text-[11px] font-bold tracking-[0.2em] uppercase px-5 py-3 transition-all ${
                tab === t.key ? 'bg-[#CC0000] text-white' : 'bg-[#1C1B1B] text-white/55 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/40">
          {counts.photo} PHOTOS · {counts.video} VIDEOS · {counts.film} FILMS
        </span>
      </div>

      {/* Collection filter */}
      {collections.length > 0 && (
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 pb-8">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/35 mr-2">
            Collection —
          </span>
          {[{ _id: 'all', name: 'ALL', badge: '' }, ...collections].map((col) => {
            const on = collectionId === col._id
            return (
              <button
                key={col._id}
                type="button"
                onClick={() => setCollectionId(col._id)}
                className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-2 transition-all ${
                  on ? 'text-white shadow-[inset_0_-2px_0_#CC0000]' : 'text-white/45 hover:text-white'
                }`}
              >
                {col._id === 'all' ? 'ALL' : col.name}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid / empty state */}
      {filtered.length === 0 ? (
        <div className="bg-[#1C1B1B] px-8 py-16 text-center">
          <p className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-[0.05em] uppercase text-white/50">
            Nothing in this cut.
          </p>
          <p className="text-[13px] text-white/40 mt-3">Try a different collection or media type.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 [grid-auto-flow:dense]">
          {filtered.map((item) => (
            <GalleryCard
              key={item._id}
              item={item}
              selected={selected.includes(item._id)}
              settings={settings}
              onOpen={() => setLightboxId(item._id)}
              onToggle={() => toggle(item._id)}
            />
          ))}
        </div>
      )}

      {/* Selection tray */}
      <AnimatePresence>
        {selected.length > 0 && !checkoutOpen && (
          <SelectionTray
            count={selected.length}
            total={total}
            packsLine={packsLine}
            onClear={() => setSelected([])}
            onCheckout={() => setCheckoutOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Lightbox */}
      {lightboxItem && (
        <GalleryLightbox
          item={lightboxItem}
          selected={selected.includes(lightboxItem._id)}
          settings={settings}
          packsLine={packsLine}
          onClose={() => setLightboxId(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onToggle={() => toggle(lightboxItem._id)}
        />
      )}

      {/* Checkout */}
      {checkoutOpen && (
        <CheckoutModal
          items={selectedItems}
          total={total}
          savings={savings}
          onClose={() => setCheckoutOpen(false)}
          onFinish={() => {
            setCheckoutOpen(false)
            setSelected([])
          }}
        />
      )}
    </div>
  )
}
