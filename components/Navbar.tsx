"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "EPISODES", href: "/episodes" },
  { label: "BLOG", href: "/blog" },
  { label: "ABOUT", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-white/10 bg-[#111111]/95 backdrop-blur-md shadow-lg shadow-black/30"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-widest text-white hover:text-[#CC0000] transition-colors"
          >
            GOTALK <span className="text-[#CC0000]">STUDIOS</span>
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
              className="relative text-xs font-semibold tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#CC0000] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </motion.nav>

        {/* CTA */}
        <motion.div
          className="hidden md:flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/contact"
            className="bg-[#CC0000] text-white text-xs font-bold tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-[#AA0000] active:scale-95 transition-all"
          >
            BOOK NOW
          </Link>
        </motion.div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5 w-6">
            <motion.span animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} className="block h-0.5 bg-white rounded-full" />
            <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} className="block h-0.5 bg-white rounded-full" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} className="block h-0.5 bg-white rounded-full" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-white/10 bg-[#111111] overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-semibold tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-2 bg-[#CC0000] text-white text-xs font-bold tracking-[0.15em] uppercase px-5 py-3 text-center hover:bg-[#AA0000] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                BOOK NOW
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
