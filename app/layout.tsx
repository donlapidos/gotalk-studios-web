import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

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
  title: "GoTalk Studios — Real People. Real Stories. Real Sarawak.",
  description:
    "GoTalk Studios is Sarawak's home for honest conversations — with the entrepreneurs building tomorrow, the leaders shaping today, and the icons defining our culture.",
  keywords: ["GoTalk Studios", "Sarawak", "talk show", "podcast", "Kuching"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#111111] text-white">
        {children}
      </body>
    </html>
  );
}
