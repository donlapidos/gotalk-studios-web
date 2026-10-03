import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import SanityImage from "@/components/SanityImage";
import type { SanityImageValue } from "@/sanity/lib/image";
import { categoryColors, fallbackCategoryColor } from "@/lib/blog";
import {
  FadeUp,
  FadeIn,
  StaggerList,
  StaggerItem,
  ScaleIn,
  LineRevealScroll,
} from "@/components/motion";

export const metadata: Metadata = {
  title:       "From The Studio",
  description: "Insights, stories, and ideas from the GoTalk Studios team in Kuching, Sarawak.",
  openGraph: {
    title:       "From The Studio",
    description: "Insights, stories, and ideas from the GoTalk Studios team in Kuching, Sarawak.",
    url:         "https://gotalkstudios.com/blog",
    type:        "website",
  },
  twitter: {
    title:       "From The Studio",
    description: "Insights, stories, and ideas from the GoTalk Studios team in Kuching, Sarawak.",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Post = {
  _id: string
  title: string
  slug: { current: string } | null
  category: string
  excerpt: string | null
  featuredImage: SanityImageValue | null
  author: string | null
  publishedAt: string | null
}

// ─── Featured Post ────────────────────────────────────────────────────────────

function FeaturedPost({ post }: { post: Post }) {
  const colorClass = categoryColors[post.category] ?? fallbackCategoryColor;
  const href = post.slug ? `/blog/${post.slug.current}` : '#';

  return (
    <ScaleIn>
      <Link
        href={href}
        className="group grid lg:grid-cols-2 gap-0 border border-white/10 hover:border-brand-red/40 transition-all bg-surface-alt mb-5 overflow-hidden"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video lg:aspect-auto min-h-[260px] overflow-hidden bg-surface-raised">
          {post.featuredImage?.asset ? (
            <SanityImage
              image={post.featuredImage}
              alt={post.title}
              width={800}
              height={500}
              className="opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-brand-red/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-alt/50 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-alt via-transparent to-transparent lg:hidden" />
        </div>

        {/* Content */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-2xs font-bold tracking-label uppercase border px-2.5 py-1 ${colorClass}`}>
              {post.category}
            </span>
            {post.publishedAt && (
              <span className="text-2xs text-white/55 uppercase tracking-widest">
                {new Date(post.publishedAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          <h2 className="font-display text-3xl lg:text-4xl text-white tracking-wide leading-tight mb-4 group-hover:text-brand-red transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-white/65 leading-relaxed mb-6">{post.excerpt}</p>
          )}
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-label uppercase text-accent group-hover:gap-4 transition-all">
            READ THE FULL STORY →
          </span>
        </div>
      </Link>
    </ScaleIn>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  const colorClass = categoryColors[post.category] ?? fallbackCategoryColor;
  const href = post.slug ? `/blog/${post.slug.current}` : '#';

  return (
    <Link
      href={href}
      className="group border border-white/8 hover:border-brand-red/40 hover:bg-surface-raised transition-all flex flex-col overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-surface-raised">
        {post.featuredImage?.asset ? (
          <SanityImage
            image={post.featuredImage}
            alt={post.title}
            width={640}
            height={360}
            className="opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-brand-red/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-2xs font-bold tracking-label uppercase border px-2 py-0.5 ${colorClass}`}>
            {post.category}
          </span>
          {post.publishedAt && (
            <span className="text-2xs text-white/55">
              {new Date(post.publishedAt).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <h3 className="font-display text-2xl text-white tracking-wide leading-tight mb-3 group-hover:text-brand-red transition-colors flex-1">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-xs text-white/60 leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
        )}
        <span className="text-xs font-bold tracking-label uppercase text-white/55 group-hover:text-accent transition-colors">
          READ MORE →
        </span>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  const { data: posts } = await sanityFetch({ query: ALL_POSTS_QUERY });
  const allPosts = (posts ?? []) as Post[];
  const featured = allPosts[0] ?? null;
  const rest = allPosts.slice(1);

  return (
    <>
      <main id="main" tabIndex={-1} className="pt-16">
        <div className="relative bg-surface-base border-b border-white/10 overflow-hidden noise">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <FadeIn delay={0.05}>
              <p className="section-label mb-6">From the Studio</p>
            </FadeIn>
            <LineRevealScroll>
              <h1 className="font-display text-5xl lg:text-7xl text-white tracking-wide mb-4">
                Beyond the Episodes.
              </h1>
            </LineRevealScroll>
            <FadeUp delay={0.2}>
              <p className="text-white/70 text-lg max-w-[62ch] leading-relaxed">
                Our take on the stories, people, and ideas moving Sarawak forward.
              </p>
            </FadeUp>
          </div>
        </div>

        <div className="bg-surface-base py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {allPosts.length === 0 ? (
              <FadeIn>
                <div className="border border-white/8 bg-surface-alt p-16 text-center">
                  <p className="font-display text-3xl text-white/55 tracking-widest">
                    POSTS COMING SOON
                  </p>
                </div>
              </FadeIn>
            ) : (
              <>
                {featured && <FeaturedPost post={featured} />}
                {rest.length > 0 && (
                  <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rest.map((post) => (
                      <StaggerItem key={post._id}>
                        <PostCard post={post} />
                      </StaggerItem>
                    ))}
                  </StaggerList>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
