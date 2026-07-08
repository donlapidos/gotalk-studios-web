import { motion } from 'framer-motion'

type Props = {
  count: number
  total: number
  packsLine: string
  onClear: () => void
  onCheckout: () => void
}

export default function SelectionTray({ count, total, packsLine, onClear, onCheckout }: Props) {
  return (
    <motion.div
      initial={{ y: 96 }}
      animate={{ y: 0 }}
      exit={{ y: 96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 bottom-0 z-[60] bg-[#0E0E0E]/95 backdrop-blur-xl shadow-[0_-24px_48px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CC0000] animate-gt-pulse shrink-0" />
          <span className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[0.05em] uppercase text-[#E5E2E1] whitespace-nowrap">
            {count} {count === 1 ? 'Frame' : 'Frames'} Selected
          </span>
          <span className="hidden md:inline text-[11px] tracking-[0.2em] uppercase text-white/40 truncate">
            {packsLine}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-[family-name:var(--font-bebas-neue)] text-[28px] tracking-[0.05em] text-[#E5E2E1]">
            RM {total}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-bold tracking-[0.2em] uppercase px-5 py-3.5 text-white outline outline-1 -outline-offset-1 outline-white/25 hover:outline-white hover:bg-white/5 transition-all"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onCheckout}
            className="text-xs font-bold tracking-[0.2em] uppercase px-7 py-3.5 bg-[#CC0000] text-white hover:bg-[#AA0000] active:scale-95 transition-all"
          >
            Checkout →
          </button>
        </div>
      </div>
    </motion.div>
  )
}
