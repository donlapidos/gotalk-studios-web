import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { imageUrl } from "@/sanity/lib/image";
import SanityImage from "@/components/SanityImage";
import { blogPtComponents } from "@/components/portable-text";
import { categoryColors, fallbackCategoryColor } from "@/lib/blog";
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
  const ogImageUrl = imageUrl(post.featuredImage, 1200, 630) ?? '/og-image.jpg'
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const colorClass = categoryColors[post.category] ?? fallbackCategoryColor

  return (
    <>
      <main id="main" tabIndex={-1} className="pt-16 bg-surface-base min-h-screen">

        {/* Hero */}
        <div className="relative bg-surface-base border-b border-white/10 overflow-hidden">
          {post.featuredImage?.asset && (
            <div className="absolute inset-0">
              <SanityImage
                image={post.featuredImage}
                alt={post.title}
                width={1200}
                height={600}
                className="opacity-20"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-base" />
            </div>
          )}
          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-2xs font-bold tracking-label uppercase border px-2.5 py-1 ${colorClass}`}>
                  {post.category}
                </span>
                {post.publishedAt && (
                  <span className="text-2xs text-white/55 uppercase tracking-widest">
                    {new Date(post.publishedAt).toLocaleDateString("en-MY", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </FadeIn>
            <FadeUp delay={0.2}>
              <h1 className="font-display text-4xl lg:text-6xl text-white tracking-wide leading-tight mb-5">
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
                <p className="text-xs text-white/55 tracking-widest uppercase mt-6">
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
                <PortableText value={post.body} components={blogPtComponents} />
              </div>
            </FadeUp>
          )}

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <Link
              href="/blog"
              className="text-xs font-bold tracking-label uppercase text-accent hover:text-white transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>

      </main>
    </>
  )
}
