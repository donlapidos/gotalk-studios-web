import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { FadeUp, FadeIn } from "@/components/motion";

const getPost = cache(async (slug: string) => {
  const { data } = await sanityFetch({ query: POST_BY_SLUG_QUERY, params: { slug } })
  return data
})

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post Not Found" }

  const description = post.excerpt ?? undefined
  let ogImageUrl = '/og-image.jpg'
  if (post.featuredImage) {
    try {
      ogImageUrl = urlFor(post.featuredImage as Parameters<typeof urlFor>[0]).width(1200).height(630).fit('crop').url()
    } catch { /* fall back to default */ }
  }
  const pageUrl = `https://gotalkstudios.com/blog/${slug}`

  return {
    title:       post.title,
    description,
    openGraph: {
      title:       post.title,
      description,
      url:         pageUrl,
      type:        'article',
      images:      [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt ?? undefined,
    },
    twitter: {
      title:       post.title,
      description,
      images:      [ogImageUrl],
    },
  }
}

// ─── Portable Text components ─────────────────────────────────────────────────

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 text-white/75 leading-relaxed">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl text-white tracking-wide mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide mt-8 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-[#CC0000] pl-5 my-6 text-white/60 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="text-white font-bold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => {
      const raw = value?.href ?? ''
      const href = /^https?:|^mailto:/.test(raw) ? raw : '#'
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#CC0000] underline hover:text-white transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }: { value: { asset?: unknown; alt?: string; caption?: string } }) => {
      if (!value?.asset) return null
      const src = urlFor(value as Parameters<typeof urlFor>[0]).width(900).url()
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden">
            <Image src={src} alt={value.alt ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-white/35 mt-2 tracking-wide">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

// ─── Category colour ──────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Business:      "text-[#CC0000] border-[#CC0000]/40",
  "Studio News": "text-blue-400 border-blue-400/40",
  Culture:       "text-amber-400 border-amber-400/40",
  Leadership:    "text-emerald-400 border-emerald-400/40",
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const colorClass = categoryColors[post.category] ?? "text-white/60 border-white/20"

  let heroSrc: string | null = null
  if (post.featuredImage) {
    try {
      heroSrc = urlFor(post.featuredImage as Parameters<typeof urlFor>[0])
        .width(1200).height(600).fit("crop").url()
    } catch { /* no image */ }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#111111] min-h-screen">

        {/* Hero */}
        <div className="relative bg-[#111111] border-b border-white/10 overflow-hidden">
          {heroSrc && (
            <div className="absolute inset-0">
              <Image src={heroSrc} alt={post.title} fill className="object-cover opacity-20" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111]" />
            </div>
          )}
          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-[10px] font-bold tracking-[0.25em] uppercase border px-2.5 py-1 ${colorClass}`}>
                  {post.category}
                </span>
                {post.publishedAt && (
                  <span className="text-[10px] text-white/25 uppercase tracking-widest">
                    {new Date(post.publishedAt).toLocaleDateString("en-MY", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </FadeIn>
            <FadeUp delay={0.2}>
              <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl lg:text-6xl text-white tracking-wide leading-tight mb-5">
                {post.title}
              </h1>
            </FadeUp>
            {post.excerpt && (
              <FadeUp delay={0.3}>
                <p className="text-white/60 text-lg leading-relaxed">{post.excerpt}</p>
              </FadeUp>
            )}
            {post.author && (
              <FadeUp delay={0.4}>
                <p className="text-xs text-white/30 tracking-widest uppercase mt-6">
                  By {post.author}
                </p>
              </FadeUp>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-14">
          {post.body && (
            <FadeUp>
              <div className="prose-custom">
                <PortableText value={post.body} components={ptComponents} />
              </div>
            </FadeUp>
          )}

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <Link
              href="/blog"
              className="text-xs font-bold tracking-[0.2em] uppercase text-[#CC0000] hover:text-white transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
