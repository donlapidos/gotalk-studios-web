import type { WatermarkStyle } from './types'

type Props = {
  text: string
  style: WatermarkStyle
  /** lightbox renders the mark larger */
  size?: 'card' | 'lightbox'
}

// Deterrent overlay on photo previews. The underlying Sanity asset is a
// web-res display copy — full-res originals never touch the site.
export default function Watermark({ text, style, size = 'card' }: Props) {
  const lb = size === 'lightbox'
  const base =
    'pointer-events-none select-none absolute inset-0 flex font-[family-name:var(--font-bebas-neue)] uppercase'

  if (style === 'diagonal') {
    return (
      <div
        aria-hidden="true"
        className={`${base} items-center justify-center whitespace-nowrap`}
        style={{ transform: 'rotate(-24deg)', fontSize: lb ? 52 : 34, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.14)' }}
      >
        {text}
      </div>
    )
  }
  if (style === 'centered') {
    return (
      <div
        aria-hidden="true"
        className={`${base} items-center justify-center`}
        style={{ fontSize: lb ? 40 : 26, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.22)' }}
      >
        {text}
      </div>
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${base} items-end justify-end`}
      style={{ padding: lb ? 18 : 12, fontSize: lb ? 16 : 12, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
    >
      {text}
    </div>
  )
}
