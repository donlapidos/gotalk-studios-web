'use client'

import { useState } from 'react'

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

export default function GuestShareButton({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (typeof navigator === 'undefined') return
    if (navigator.share) {
      navigator.share({ title: name, url }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-11 h-11 bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-colors"
      aria-label={copied ? 'Link copied!' : 'Share'}
      title={copied ? 'Link copied!' : 'Share'}
    >
      <ShareIcon />
    </button>
  )
}
