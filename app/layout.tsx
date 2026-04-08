import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gotalkstudios.com"),
  title: {
    default:  "GoTalk Studios | Real People. Real Stories. Real Sarawak.",
    template: "%s | GoTalk Studios",
  },
  description:
    "GoTalk Studios is Sarawak's home for honest conversations — with the entrepreneurs building tomorrow, the leaders shaping today, and the icons defining our culture.",
  keywords: ["GoTalk Studios", "Sarawak", "talk show", "podcast", "Kuching"],
  openGraph: {
    siteName: "GoTalk Studios",
    images:   [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "GoTalk Studios — Real People. Real Stories. Real Sarawak." }],
    locale:   "en_MY",
    type:     "website",
  },
  twitter: {
    card:   "summary_large_image",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: preview } = await draftMode()
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#111111] text-white">
        {children}
        {preview && <SanityLive />}
        <Analytics />
      </body>
    </html>
  );
}
