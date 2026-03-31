import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog — GoTalk Studios",
  description: "Our take on the stories, people, and ideas moving Sarawak forward.",
};
import {
  FadeUp,
  FadeIn,
  StaggerList,
  StaggerItem,
  ScaleIn,
  DrawLine,
  LineRevealScroll,
} from "@/components/motion";

const posts = [
  { slug: "sarawak-entrepreneurship-scene-moment", category: "BUSINESS", title: "Why Sarawak's Entrepreneurship Scene Is Having Its Moment", excerpt: "The numbers are there. The energy is there. After 11 episodes with Sarawak's most driven founders, we break down why right now might be the most exciting time to build a business in this state — and who's leading the charge.", featured: true, seed: "blog01", readTime: "6 min read" },
  { slug: "5-things-learned-sarawak-founders", category: "BUSINESS", title: "5 Things We've Learned From Interviewing Sarawak's Most Successful Founders", excerpt: "After sitting across from some of the sharpest minds in the region, patterns start to emerge. The best entrepreneurs in Sarawak aren't just talented — they think differently. Here's what they have in common.", featured: false, seed: "blog02", readTime: "5 min read" },
  { slug: "gotalk-politics-different", category: "STUDIO NEWS", title: "GoTalk Politics Is Here — And It's Going to Be Different", excerpt: "We sat down with YB Dato Ir Lo Khere Chiang for our first political episode. No prepared questions. No PR handlers. Just a conversation. Here's why we think it matters.", featured: false, seed: "blog03", readTime: "4 min read" },
  { slug: "what-makes-great-gotalk-guest", category: "CULTURE", title: "What Makes a Great GoTalk Guest? It's Not What You Think.", excerpt: "It's not fame. It's not a big business. The guests who make the best GoTalk episodes share one thing in common — and it has nothing to do with success. Lionel and Gordon share what they've discovered after 20 recordings.", featured: false, seed: "blog04", readTime: "7 min read" },
];

const categoryColors: Record<string, string> = {
  BUSINESS: "text-[#CC0000] border-[#CC0000]/40",
  "STUDIO NEWS": "text-blue-400 border-blue-400/40",
  CULTURE: "text-amber-400 border-amber-400/40",
  LEADERSHIP: "text-emerald-400 border-emerald-400/40",
};

function FeaturedPost({ post }: { post: (typeof posts)[0] }) {
  const colorClass = categoryColors[post.category] ?? "text-white/60 border-white/20";
  return (
    <ScaleIn>
      <Link
        href={`/blog/${post.slug}`}
        className="group grid lg:grid-cols-2 gap-0 border border-white/10 hover:border-[#CC0000]/40 transition-all bg-[#161616] mb-5 overflow-hidden"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video lg:aspect-auto min-h-[260px] overflow-hidden">
          <Image
            src={`https://picsum.photos/seed/${post.seed}gt/800/500`}
            alt={post.title}
            fill
            className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#161616]/50 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent lg:hidden" />
        </div>

        {/* Content */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[10px] font-bold tracking-[0.25em] uppercase border px-2.5 py-1 ${colorClass}`}>
              {post.category}
            </span>
            <span className="text-[10px] text-white/25 uppercase tracking-widest">
              {post.readTime}
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl lg:text-4xl text-white tracking-wide leading-tight mb-4 group-hover:text-[#CC0000] transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-white/45 leading-relaxed mb-6">
            {post.excerpt}
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#CC0000] group-hover:gap-4 transition-all">
            READ THE FULL STORY →
          </span>
        </div>
      </Link>
    </ScaleIn>
  );
}

function PostCard({ post }: { post: (typeof posts)[0] }) {
  const colorClass = categoryColors[post.category] ?? "text-white/60 border-white/20";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border border-white/8 hover:border-[#CC0000]/40 hover:bg-[#1A1A1A] transition-all flex flex-col overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={`https://picsum.photos/seed/${post.seed}gt/640/360`}
          alt={post.title}
          fill
          className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[10px] font-bold tracking-[0.25em] uppercase border px-2 py-0.5 ${colorClass}`}>
            {post.category}
          </span>
          <span className="text-[10px] text-white/20">{post.readTime}</span>
        </div>
        <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide leading-tight mb-3 group-hover:text-[#CC0000] transition-colors flex-1">
          {post.title}
        </h3>
        <p className="text-xs text-white/40 leading-relaxed mb-5 line-clamp-3">
          {post.excerpt}
        </p>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/25 group-hover:text-[#CC0000] transition-colors">
          READ MORE →
        </span>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const featured = posts.find((p) => p.featured)!;
  const rest = posts.filter((p) => !p.featured);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="relative bg-[#111111] border-b border-white/10 overflow-hidden noise">
          <div className="absolute inset-0">
            <Image
              src="https://picsum.photos/seed/bloghero/1920/500"
              alt=""
              fill
              className="object-cover opacity-10"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/60 to-[#111111]" />
          </div>
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
              <p className="text-white/50 text-lg max-w-xl leading-relaxed">
                Our take on the stories, people, and ideas moving Sarawak forward.
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Category filter */}
        <div className="border-b border-white/10 bg-[#111111]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-6 overflow-x-auto py-4">
              {["ALL POSTS", "BUSINESS", "LEADERSHIP", "CULTURE", "STUDIO NEWS"].map((cat) => (
                <button
                  key={cat}
                  className={`text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap pb-1 transition-all ${
                    cat === "ALL POSTS"
                      ? "text-white border-b-2 border-[#CC0000]"
                      : "text-white/30 hover:text-white border-b-2 border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#111111] py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FeaturedPost post={featured} />
            <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((post) => (
                <StaggerItem key={post.slug}>
                  <PostCard post={post} />
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
