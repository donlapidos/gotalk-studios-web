"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "EPISODES", href: "/episodes" },
  { label: "SERVICES", href: "/services" },
  { label: "GUESTS", href: "/guests" },
  { label: "GALLERY", href: "/gallery" },
  { label: "BLOG", href: "/blog" },
  { label: "ABOUT", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-white/10 bg-surface-base/95 backdrop-blur-md shadow-lg shadow-black/30"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* px-4 and a tighter logo at the smallest widths: the row previously
          measured 417px of content inside a 390px viewport, which surfaced as
          10px of real horizontal page scroll on the home page and sat latent on
          every other route. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-2 sm:gap-3">
        {/* Logo */}
        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="inline-flex items-center min-h-[44px] font-display text-xl sm:text-2xl tracking-wide sm:tracking-widest text-white hover:text-brand-red transition-colors whitespace-nowrap"
          >
            GOTALK <span className="text-brand-red">&nbsp;STUDIOS</span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav
          className="hidden md:flex items-center gap-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-xs font-semibold tracking-wide hover:text-white transition-colors uppercase group ${
                isActive(href) ? "text-white" : "text-white/70"
              }`}
            >
              {label}
              <span
                className={`absolute bottom-2.5 left-0 h-px bg-brand-red group-hover:w-full transition-all duration-300 ${
                  isActive(href) ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}
        </motion.nav>

        <div className="flex items-center gap-2">
          {/* The booking CTA — the site's only conversion button — used to be
              `hidden md:flex`, so on mobile it did not exist at all. It is now
              visible at every width, and deep-links to the booking form itself
              rather than to the top of /contact. */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/contact#book"
              className="inline-flex items-center justify-center bg-brand-red text-white text-2xs sm:text-xs font-bold tracking-wide uppercase px-3 sm:px-5 min-h-[44px] hover:bg-brand-red-hover active:scale-95 transition-all whitespace-nowrap"
            >
              {/* Short label below sm so the row fits a 390px viewport. */}
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">Book Studio</span>
            </Link>
          </motion.div>

          {/* Mobile hamburger — was 40×34, under 44 in both axes, and the only
              way to navigate on a phone. */}
          <button
            className="md:hidden text-white inline-flex items-center justify-center w-11 h-11 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="space-y-1.5 w-6 block">
              <motion.span animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} className="block h-0.5 bg-white rounded-full" />
              <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} className="block h-0.5 bg-white rounded-full" />
              <motion.span animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} className="block h-0.5 bg-white rounded-full" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-white/10 bg-surface-base overflow-hidden"
            id="mobile-menu"
          >
            <nav className="flex flex-col px-6 py-3" aria-label="Main">
              {/* Drawer links were 342×28 — full width but 16px short of a real
                  touch target, on the only navigation a phone user has. */}
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`flex items-center min-h-[48px] text-sm font-semibold tracking-wide hover:text-white transition-colors uppercase border-b border-white/[0.06] ${
                    isActive(href) ? "text-white" : "text-white/70"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
