"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

// Pre-trigger margin: fires 300px before element enters the viewport from below
const MARGIN = "0px 0px 300px 0px" as const;

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// ─── FadeUp ───────────────────────────────────────────────────────────────────
export function FadeUp({ children, delay = 0, className = "" }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: MARGIN });
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
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
  const inView = useInView(ref, { once: true, margin: MARGIN });
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
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
  const inView = useInView(ref, { once: true, margin: MARGIN });
  return (
    <div style={{ overflow: "hidden" }} ref={ref} className={className}>
      <motion.div
        initial={reduced ? false : { y: "105%" }}
        animate={inView ? { y: 0 } : {}}
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
  const inView = useInView(ref, { once: true, margin: MARGIN });
  return (
    <motion.span
      ref={ref}
      initial={reduced ? false : { scaleX: 0, transformOrigin: "left" }}
      animate={inView ? { scaleX: 1 } : {}}
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
  const inView = useInView(ref, { once: true, margin: MARGIN });
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
  const inView = useInView(ref, { once: true, margin: MARGIN });
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { motion };
