import { useActionState } from 'react'
import { submitGalleryOrder } from '@/app/actions/order'
import type { GalleryItem } from './types'

type Props = {
  items: GalleryItem[]
  total: number
  savings: number
  onClose: () => void
  onFinish: () => void
}

// Invisible to humans (and skipped by screen readers); bots auto-fill it and
// get silently dropped server-side.
function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label>
        Website URL
        <input name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}

export default function CheckoutModal({ items, total, savings, onClose, onFinish }: Props) {
  const [state, action, pending] = useActionState(submitGalleryOrder, null)

  const payload = JSON.stringify(
    items.map((it) => ({ id: it._id, title: it.title, badge: it.collection?.badge ?? '' }))
  )

  return (
    <div
      className="fixed inset-0 z-[80] bg-[#0E0E0E]/[0.92] backdrop-blur-md flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="relative w-full max-w-md bg-[#1C1B1B] p-10 sm:p-11 shadow-[0_24px_48px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-auto">
        <button
          type="button"
          onClick={state?.success ? onFinish : onClose}
          aria-label="Close"
          className="absolute top-5 right-6 text-white/60 hover:text-white text-xl leading-none p-1"
        >
          ✕
        </button>

        {state?.success ? (
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CC0000] animate-gt-pulse" />
              <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.3em] uppercase">Order Received</span>
            </div>
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-[44px] leading-[0.93] uppercase text-[#E5E2E1]">
              The Frames Are Almost Yours.
            </h2>
            <p className="text-sm leading-relaxed text-white/60">
              We&apos;ve received your order. We&apos;ll email you payment details (DuitNow / bank
              transfer), and your full-resolution, watermark-free files follow as soon as payment
              clears.
            </p>
            <div className="flex flex-col gap-1">
              {items.map((it) => (
                <div key={it._id} className="bg-[#232221] px-4 py-3 flex items-center justify-between gap-3">
                  <span className="font-[family-name:var(--font-bebas-neue)] text-[17px] tracking-[0.05em] uppercase text-[#E5E2E1] truncate">
                    {it.title}
                  </span>
                  {it.collection?.badge && (
                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 whitespace-nowrap">
                      {it.collection.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onFinish}
              className="text-xs font-bold tracking-[0.2em] uppercase px-7 py-4 text-white outline outline-1 -outline-offset-1 outline-white/25 hover:outline-white hover:bg-white/5 transition-all"
            >
              Back to Gallery
            </button>
          </div>
        ) : (
          <form action={action} className="flex flex-col gap-5">
            <HoneypotField />
            <input type="hidden" name="items" value={payload} />
            <input type="hidden" name="total" value={`RM ${total}`} />

            <div className="inline-flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#CC0000] inline-block" />
              <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.3em] uppercase">Checkout</span>
            </div>
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-[44px] leading-[0.93] uppercase text-[#E5E2E1]">
              Almost Yours.
            </h2>

            <div className="bg-[#232221] px-5 py-4 flex items-baseline justify-between">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/50">
                {items.length} {items.length === 1 ? 'Frame' : 'Frames'}
              </span>
              <span className="font-[family-name:var(--font-bebas-neue)] text-[32px] text-[#E5E2E1]">RM {total}</span>
            </div>

            {savings > 0 && (
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#CC0000]">
                Set pricing applied — you save RM {savings}
              </span>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="gallery-order-email" className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/45">
                Email for delivery
              </label>
              <input
                id="gallery-order-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="bg-[#353534] text-[#E5E2E1] text-sm px-4 py-4 placeholder-white/20 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-white/30"
              />
            </div>

            {state?.error && <p className="text-xs text-[#CC0000]">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="text-xs font-bold tracking-[0.2em] uppercase px-7 py-4 bg-[#CC0000] text-white hover:bg-[#AA0000] active:scale-[0.97] transition-all disabled:opacity-60"
            >
              {pending ? 'SENDING…' : 'SEND ORDER REQUEST →'}
            </button>
            <span className="text-[11px] leading-relaxed text-white/35">
              No payment is taken online. We reply with payment details, and full-resolution,
              watermark-free files are delivered after payment clears.
            </span>
          </form>
        )}
      </div>
    </div>
  )
}
