'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'

// ─── Types ────────────────────────────────────────────────────────────────────

type SocialLinks = {
  instagram?: string | null
  linkedin?: string | null
  website?: string | null
  facebook?: string | null
}

type Episode = {
  _id: string
  title: string | null
  episodeNumber: number
  youtubeUrl: string | null
}

export type GuestItem = {
  _id: string
  name: string
  slug: { current: string }
  photo: unknown
  title: string | null
  company: string | null
  segment: string | null
  domainFocus: string[] | null
  socialLinks: SocialLinks | null
  featured: boolean | null
  episode: Episode | null
}

const TABS = ['All Shows', 'Business', 'Politics', 'Icons'] as const
type Tab = (typeof TABS)[number]

// ─── Card animation variants ──────────────────────────────────────────────────

const cardVariants: Variants = {
  rest: { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' },
  hover: { y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.7)' },
}

const photoVariants: Variants = {
  rest: { filter: 'grayscale(100%) contrast(1.1)' },
  hover: { filter: 'grayscale(0%) contrast(1)' },
}

const overlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
}

// ─── Hotspot helper ───────────────────────────────────────────────────────────

function getObjectPosition(photo: unknown): string {
  if (photo && typeof photo === 'object' && 'hotspot' in photo) {
    const h = (photo as { hotspot?: { x: number; y: number } }).hotspot
    if (h && typeof h.x === 'number' && typeof h.y === 'number') {
      return `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%`
    }
  }
  return 'center 15%'
}

// ─── Guest Card ───────────────────────────────────────────────────────────────

function GuestCard({ guest }: { guest: GuestItem }) {
  let photoUrl: string | null = null
  if (guest.photo) {
    try {
      photoUrl = urlFor(guest.photo as Parameters<typeof urlFor>[0])
        .width(480)
        .height(640)
        .fit('crop')
        .crop('focalpoint')
        .url()
    } catch { /* no photo */ }
  }

  const objectPosition = getObjectPosition(guest.photo)

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative border border-[#222]"
    >
      <Link href={`/guests/${guest.slug.current}`} className="block">

        {/* Photo — 3:4 portrait */}
        <div className="relative overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '3 / 4' }}>
          {photoUrl ? (
            <motion.div
              variants={photoVariants}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={photoUrl}
                alt={guest.name}
                fill
                className="object-cover"
                style={{ objectPosition }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-20 h-20 text-white/10" fill="currentColor" aria-hidden="true">
                <path d="M12 12a5 5 0 110-10 5 5 0 010 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" />
              </svg>
            </div>
          )}

          {/* Red gradient overlay on hover */}
          <motion.div
            variants={overlayVariants}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(204,0,0,0.3) 0%, transparent 60%)' }}
          />
        </div>

        {/* Info bar — name + company only */}
        <div className="bg-[#F0F0EE] px-4 pt-4 pb-5">
          <h3
            className="font-[family-name:var(--font-bebas-neue)] text-[#111111] leading-[1.0] break-words"
            style={{ fontSize: 'clamp(1.45rem, 2.5vw, 1.9rem)', letterSpacing: '0.03em' }}
          >
            {guest.name.toUpperCase()}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1 tracking-widest uppercase leading-relaxed">
            {guest.company || guest.title || ' '}
          </p>
        </div>

      </Link>
    </motion.div>
  )
}

// ─── GuestsDirectory ──────────────────────────────────────────────────────────

export default function GuestsDirectory({ guests }: { guests: GuestItem[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('All Shows')
  const [search, setSearch] = useState('')

  const filtered = guests.filter((g) => {
    const matchTab = activeTab === 'All Shows' || g.segment === activeTab
    const q = search.toLowerCase().trim()
    const matchSearch =
      !q ||
      g.name.toLowerCase().includes(q) ||
      (g.company?.toLowerCase().includes(q) ?? false) ||
      (g.domainFocus?.some((d) => d.toLowerCase().includes(q)) ?? false)
    return matchTab && matchSearch
  })

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-white/10 pb-5 mb-12">
        <div className="flex gap-6 sm:gap-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-[11px] font-bold tracking-[0.2em] uppercase pb-2.5 transition-colors ${
                activeTab === tab ? 'text-white' : 'text-white/35 hover:text-white/70'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#CC0000]"
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="SEARCH GUESTS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white/70 text-[11px] tracking-[0.12em] uppercase placeholder:text-white/20 px-4 py-2.5 pr-9 focus:outline-none focus:border-white/20 w-52"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}::${search}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filtered.map((g) => (
            <GuestCard key={g._id} guest={g} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <p className="text-white/20 text-sm tracking-[0.3em] uppercase">No guests found</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
