import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { ALL_POSTS_QUERY, GUEST_SLUGS_QUERY } from '@/sanity/lib/queries'

const BASE = 'https://gotalkstudios.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                            lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/episodes`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/guests`,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/blog`,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/about`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy-policy`,        lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms-of-service`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // Dynamic guest bio routes
  let guestRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: guests } = await sanityFetch({ query: GUEST_SLUGS_QUERY })
    if (Array.isArray(guests)) {
      guestRoutes = guests
        .filter((g: { slug?: string | null }) => g?.slug)
        .map((g: { slug: string; _updatedAt?: string }) => ({
          url:             `${BASE}/guests/${g.slug}`,
          lastModified:    g._updatedAt ? new Date(g._updatedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority:        0.8,
        }))
    }
  } catch { /* sitemap still works without guests */ }

  // Dynamic blog post routes
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: posts } = await sanityFetch({ query: ALL_POSTS_QUERY })
    if (Array.isArray(posts)) {
      blogRoutes = posts
        .filter((p: { slug?: { current?: string }; publishedAt?: string }) => p?.slug?.current)
        .map((p: { slug: { current: string }; publishedAt?: string }) => ({
          url:             `${BASE}/blog/${p.slug.current}`,
          lastModified:    p.publishedAt ? new Date(p.publishedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority:        0.6,
        }))
    }
  } catch { /* sitemap still works without blog posts */ }

  return [...staticRoutes, ...guestRoutes, ...blogRoutes]
}
