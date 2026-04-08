import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import {
  FadeUp,
  FadeIn,
  StaggerList,
  StaggerItem,
  ScaleIn,
  DrawLine,
  LineRevealScroll,
} from "@/components/motion";

export const metadata: Metadata = {
  title:       "From The Studio | GoTalk Studios Blog",
  description: "Insights, stories, and ideas from the GoTalk Studios team in Kuching, Sarawak.",
  openGraph: {
    title:       "From The Studio | GoTalk Studios Blog",
    description: "Insights, stories, and ideas from the GoTalk Studios team in Kuching, Sarawak.",
    url:         "https://gotalkstudios.com/blog",
    type:        "website",
  },
  twitter: {
    title:       "From The Studio | GoTalk Studios Blog",
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
  featuredImage: unknown
  author: string | null
  publishedAt: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Business:     "text-[#CC0000] border-[#CC0000]/40",
  "Studio News": "text-blue-400 border-blue-400/40",
  Culture:      "text-amber-400 border-amber-400/40",
  Leadership:   "text-emerald-400 border-emerald-400/40",
};

function postImageUrl(image: unknown, width: number, height: number): string | null {
  if (!image) return null;
  try {
    return urlFor(image as Parameters<typeof urlFor>[0])
      .width(width)
      .height(height)
      .fit('crop')
      .url();
  } catch {
    return null;
  }
}

// ─── Featured Post ────────────────────────────────────────────────────────────

function FeaturedPost({ post }: { post: Post }) {
  const colorClass = categoryColors[post.category] ?? "text-white/60 border-white/20";
  const imgUrl = postImageUrl(post.featuredImage, 800, 500);
  const href = post.slug ? `/blog/${post.slug.current}` : '#';

  return (
    <ScaleIn>
      <Link
        href={href}
        className="group grid lg:grid-cols-2 gap-0 border border-white/10 hover:border-[#CC0000]/40 transition-all bg-[#161616] mb-5 overflow-hidden"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video lg:aspect-auto min-h-[260px] overflow-hidden bg-[#1A1A1A]">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={post.title}
              fill
              className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#CC0000]/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#161616]/50 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent lg:hidden" />
        </div>

        {/* Content */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[10px] font-bold tracking-[0.25em] uppercase border px-2.5 py-1 ${colorClass}`}>
              {post.category}
            </span>
            {post.publishedAt && (
              <span className="text-[10px] text-white/25 uppercase tracking-widest">
                {new Date(post.publishedAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl lg:text-4xl text-white tracking-wide leading-tight mb-4 group-hover:text-[#CC0000] transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-white/65 leading-relaxed mb-6">{post.excerpt}</p>
          )}
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#CC0000] group-hover:gap-4 transition-all">
            READ THE FULL STORY →
          </span>
        </div>
      </Link>
    </ScaleIn>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  const colorClass = categoryColors[post.category] ?? "text-white/60 border-white/20";
  const imgUrl = postImageUrl(post.featuredImage, 640, 360);
  const href = post.slug ? `/blog/${post.slug.current}` : '#';

  return (
    <Link
      href={href}
      className="group border border-white/8 hover:border-[#CC0000]/40 hover:bg-[#1A1A1A] transition-all flex flex-col overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#1A1A1A]">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={post.title}
            fill
            className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#CC0000]/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[10px] font-bold tracking-[0.25em] uppercase border px-2 py-0.5 ${colorClass}`}>
            {post.category}
          </span>
          {post.publishedAt && (
            <span className="text-[10px] text-white/20">
              {new Date(post.publishedAt).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide leading-tight mb-3 group-hover:text-[#CC0000] transition-colors flex-1">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-xs text-white/60 leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
        )}
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/25 group-hover:text-[#CC0000] transition-colors">
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
      <Navbar />
      <main className="pt-16">
        <div className="relative bg-[#111111] border-b border-white/10 overflow-hidden noise">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC0000]" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-3">
                <DrawLine delay={0.2} className="w-8 h-px bg-[#CC0000]" />
                <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                  From the Studio
                </span>
              </div>
            </FadeIn>
            <LineRevealScroll>
              <h1 className="font-[family-name:var(--font-bebas-neue)] text-6xl lg:text-8xl text-white tracking-wide mb-4">
                Beyond the Episodes.
              </h1>
            </LineRevealScroll>
            <FadeUp delay={0.2}>
              <p className="text-white/65 text-lg max-w-xl leading-relaxed">
                Our take on the stories, people, and ideas moving Sarawak forward.
              </p>
            </FadeUp>
          </div>
        </div>

        <div className="bg-[#111111] py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {allPosts.length === 0 ? (
              <FadeIn>
                <div className="border border-white/8 bg-[#161616] p-16 text-center">
                  <p className="font-[family-name:var(--font-bebas-neue)] text-3xl text-white/20 tracking-widest">
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
      <Footer />
    </>
  );
}
