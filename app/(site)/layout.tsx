import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SanityLive } from "@/sanity/lib/live";

// SanityLive lives here (not in the root layout) so it never mounts on
// /studio — its refresh-on-focus behavior was reloading the Studio UI
// mid-upload whenever the OS file picker returned focus to the window.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* There was no skip link on any page, so keyboard users tabbed six nav
          links plus the CTA on every single load. Each page's <main> carries
          id="main" as the target. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      {children}
      <Footer />
      <SanityLive />
    </>
  );
}
