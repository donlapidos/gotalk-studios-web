import Link from "next/link";
import { WHATSAPP_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-base">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <p className="font-display text-xl tracking-widest text-white mb-1">
              GOTALK <span className="text-brand-red">STUDIOS</span>
            </p>
            <p className="text-xs text-white/70 tracking-wide uppercase">
              Real People. Real Stories. Real Sarawak.
            </p>
          </div>

          {/* Links — every one of these was a ~16px-tall tap target. */}
          <nav className="flex flex-wrap gap-x-6" aria-label="Footer">
            {[
              { label: "Episodes", href: "/episodes" },
              { label: "Services", href: "/services" },
              { label: "Guests", href: "/guests" },
              { label: "Gallery", href: "/gallery" },
              { label: "Blog", href: "/blog" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-xs text-white/70 hover:text-white transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex flex-wrap items-center gap-x-6">
            {WHATSAPP_URL && (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] text-xs text-white/70 hover:text-accent transition-colors uppercase tracking-wide"
              >
                WhatsApp
              </a>
            )}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-[44px] text-xs text-white/70 hover:text-accent transition-colors uppercase tracking-wide"
            >
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} GoTalk Studios. All Rights Reserved.
          </p>
          <div className="flex flex-wrap gap-x-6">
            {[
              { label: "Privacy Policy",   href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center min-h-[44px] text-xs text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
