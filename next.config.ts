import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline/eval; GA requires tagmanager + analytics.
      // va.vercel-scripts.com was missing, so @vercel/analytics was blocked on
      // every page load and never reported anything in production.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",                // Tailwind inline styles
      "img-src 'self' data: blob: https://i.ytimg.com https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com",
      "frame-src https://www.youtube-nocookie.com",
      // GA4 posts hits to https://www.google.com/g/collect and, for some
      // configurations, googletagmanager.com/td — both were absent, so a portion
      // of analytics traffic was dropped at the browser.
      "connect-src 'self' https://*.api.sanity.io https://*.sanity.io wss://*.api.sanity.io https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.google.com https://www.googletagmanager.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      "font-src 'self'",                                 // next/font self-hosts at build time
      "media-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
