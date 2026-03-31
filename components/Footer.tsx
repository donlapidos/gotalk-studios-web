import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <p className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-widest text-white mb-1">
              GOTALK <span className="text-[#CC0000]">STUDIOS</span>
            </p>
            <p className="text-xs text-white/40 tracking-widest uppercase">
              Real People. Real Stories. Real Sarawak.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6">
            {[
              { label: "Episodes", href: "/episodes" },
              { label: "About", href: "/about" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/gotalkstudios"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/50 hover:text-[#CC0000] transition-colors uppercase tracking-widest"
            >
              @gotalkstudios
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2026 GoTalk Studios. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
