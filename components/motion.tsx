"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// useLayoutEffect warns when a client component is server-rendered; on the server
// there is no layout pass to run it in, so fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ease = [0.22, 1, 0.36, 1] as const;

// Pre-trigger margin: fires 300px before element enters the viewport from below
const MARGIN = "0px 0px 300px 0px" as const;

// Safety net. Every wrapper below starts at opacity 0, so anything that stops
// the IntersectionObserver from firing used to hide the content permanently —
// `animate` received `{}`, which asserts nothing, so a full-page capture with no
// scroll rendered the hero, the stats bar, and ~2,700px of blank black between
// them. Content visibility must never depend on the observer, so:
//   1. `animate` always asserts a concrete value (never `{}`), and
//   2. this timeout reveals anything still hidden shortly after mount.
// globals.css covers print and reduced-motion, where JS state is irrelevant.
const REVEAL_FALLBACK_MS = 1200;

function useRevealed(ref: React.RefObject<Element | null>) {
  const inView = useInView(ref, { once: true, margin: MARGIN });
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (inView) return;
    const t = setTimeout(() => setTimedOut(true), REVEAL_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [inView]);

  return inView || timedOut;
}

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// ─── FadeUp ───────────────────────────────────────────────────────────────────
export function FadeUp({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRevealed(ref);
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 28 }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
export function FadeIn({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRevealed(ref);
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── LineReveal — clips text from below on mount (hero use) ───────────────────
export function LineReveal({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  return (
    <div style={{ overflow: "hidden" }} className={className}>
      <motion.div
        initial={reduced ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── LineRevealScroll — clips text on scroll entry ────────────────────────────
export function LineRevealScroll({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRevealed(ref);
  return (
    <div style={{ overflow: "hidden" }} ref={ref} className={className}>
      <motion.div
        initial={reduced ? false : { y: "105%" }}
        animate={{ y: inView ? 0 : "105%" }}
        transition={{ duration: 0.8, delay, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── DrawLine — animates width from 0 ────────────────────────────────────────
export function DrawLine({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useRevealed(ref);
  return (
    <motion.span
      ref={ref}
      initial={reduced ? false : { scaleX: 0, transformOrigin: "left" }}
      animate={{ scaleX: inView ? 1 : 0 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
      style={{ display: "block" }}
    />
  );
}

// ─── Stagger container + item ─────────────────────────────────────────────────
const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const staggerItemReduced: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

export function StaggerList({ children, className = "" }: Omit<Props, "delay">) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRevealed(ref);
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: Omit<Props, "delay">) {
  const reduced = useReducedMotion();
  return (
    <motion.div variants={reduced ? staggerItemReduced : staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// ─── ScaleIn ─────────────────────────────────────────────────────────────────
export function ScaleIn({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRevealed(ref);
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.96 }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── SlideInLeft — opacity + x offset ────────────────────────────────────────
export function SlideInLeft({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRevealed(ref);
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -20 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ClipReveal — wipes the element in behind a clip edge ────────────────────
//
// Reaches past transform and opacity. A card whose plate wipes up from its own
// bottom edge reads as a physical object being dealt onto the page, which suits
// the plate cards far better than one more fade-and-rise. `willChange` is set only
// while the wipe is pending so it doesn't hold a layer for the page's lifetime.
export function ClipReveal({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: Props & { from?: "bottom" | "left" }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRevealed(ref);
  const hidden =
    from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { clipPath: hidden, opacity: 0 }}
      animate={{
        clipPath: inView ? "inset(0% 0% 0% 0%)" : hidden,
        opacity: inView ? 1 : 0,
      }}
      transition={{ duration: 0.85, delay, ease }}
      style={{ willChange: inView ? "auto" : "clip-path" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── BlurUp — depth-of-field entrance for headings and blocks of copy ────────
export function BlurUp({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRevealed(ref);
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{
        opacity: inView ? 1 : 0,
        y: inView ? 0 : 18,
        filter: inView ? "blur(0px)" : "blur(10px)",
      }}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── CountUp — ticks a figure up to its real value ───────────────────────────
//
// For the figures band. A number that counts is the only place on the site where
// motion carries meaning rather than decoration, so it earns the exception.
export function CountUp({
  to,
  className = "",
  delay = 0,
}: {
  to: number;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useRevealed(ref);

  // The REAL figure is the resting state, so the server-rendered HTML carries the
  // true number. Seeding this at 0 instead would ship "0 Episodes Recorded" to
  // anything that doesn't run the animation — no JS, a dead observer, a scraper —
  // which is worse than not animating at all. The zero is introduced on the client
  // in a layout effect, before first paint, so there is no flash of the real value.
  const [value, setValue] = useState(to);
  const armed = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (reduced || armed.current) return;
    armed.current = true;
    setValue(0);
  }, [reduced]);

  useEffect(() => {
    if (reduced || !inView) return;
    let raf = 0;
    let start: number | null = null;
    const DURATION = 900;
    const tick = (t: number) => {
      if (start === null) start = t + delay * 1000;
      const elapsed = t - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / DURATION);
      // Same exponential ease-out the rest of the system uses.
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced, delay]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

// ─── DrawLineY — animates height from 0 (vertical line reveal) ───────────────
export function DrawLineY({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useRevealed(ref);
  return (
    <motion.span
      ref={ref}
      initial={reduced ? false : { scaleY: 0, transformOrigin: "top" }}
      animate={{ scaleY: inView ? 1 : 0 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
      style={{ display: "block" }}
    />
  );
}

export { motion };
