import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { videoIds } from "@/lib/episodes";

export const metadata: Metadata = {
  title: "Episodes — GoTalk Studios",
  description: "Every episode is a window into the people, ideas, and stories that make Sarawak who she is.",
};
import {
  FadeUp,
  FadeIn,
  StaggerList,
  StaggerItem,
  DrawLine,
  LineRevealScroll,
} from "@/components/motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const businessEpisodes = [
  { ep: "EP 11", epKey: "ep11", title: "What Would You Do If You Couldn't Say No to a Job?", guest: "Jasveena — Jasveena Cleaning Service", description: "Jasveena built her cleaning business from the ground up while holding down a job she couldn't afford to leave. A story about courage, sacrifice, and knowing when to finally bet on yourself." },
  { ep: "EP 10", epKey: "ep10", title: "60 Years in the F&B Business — The Secret That Keeps This Family Going", guest: "Live Train Group", description: "Six decades. One family. Countless lessons. We sit down with the people behind Live Train Group to uncover what it really takes to build a food business that outlasts generations." },
  { ep: "EP 09", epKey: "ep09", title: "Before You Judge Pole Fitness, Watch This", guest: "Pole Fitness Kuching", description: "Misunderstood and underestimated — Pole Fitness Kuching is changing minds one class at a time. The founders share how they built a serious fitness brand in the face of serious skepticism." },
  { ep: "EP 08", epKey: "ep08", title: "I Didn't Expect This From My Clients", guest: "Deft Level Up Fitness", description: "Running a fitness business in Sarawak comes with surprises. The team at Deft Level Up Fitness share the moments that challenged them — and the client stories that made it all worth it." },
  { ep: "EP 07", epKey: "ep07", title: "3 Months with No Business", guest: "Hua Kin Structural Company", description: "Every entrepreneur faces a wall. Hua Kin Structural Company hit theirs hard — and came out the other side. A raw, honest conversation about survival, grit, and keeping the faith." },
  { ep: "EP 06", epKey: "ep06", title: "People Tried to Sabotage My Business", guest: "Nasi Briyani Bajet Kasih", description: "Not everyone wants to see you succeed. The founder of Nasi Briyani Bajet Kasih opens up about the betrayals, the competition, and how staying focused on the food kept everything together." },
  { ep: "EP 05", epKey: "ep05", title: "Why Most People Fail in the Homestay Business", guest: "Putra Sentos Homestay", description: "The hospitality game looks easy from the outside. Putra Sentos breaks down the mistakes most operators make — and the mindset shift that separates those who last from those who don't." },
  { ep: "EP 04", epKey: "ep04", title: "The One Thing AI Can't Replace", guest: "ARX Media", description: "As AI reshapes the creative industry, ARX Media is leaning into what makes humans irreplaceable. A conversation about technology, storytelling, and the future of media in Sarawak." },
  { ep: "EP 03", epKey: "ep03", title: "Would You Still Continue If Your Business Partner Betrayed You?", guest: "TheGO", description: "Partnership is one of the hardest parts of building a business. The story behind TheGO is a testament to resilience — and knowing when to rebuild from the ground up." },
  { ep: "EP 02", epKey: "ep02", title: "Nobody Warned Him About This in the F&B Business", guest: "Chubbs Burger", description: "The food business is romanticised. Chubbs Burger's founder shares what the glossy Instagram posts don't show — and the hard-won wisdom behind every burger sold." },
  { ep: "EP 01", epKey: "ep01", title: "What It REALLY Takes to Open a Hotel in Sarawak", guest: "Viva Hotel", description: "Opening a hotel sounds glamorous. The reality is anything but. The team behind Viva Hotel share the unglamorous, inspiring truth about building hospitality from scratch in Sarawak." },
];

const politicsEpisodes = [
  { ep: "SPECIAL", epKey: "politics-special", title: "The Untold Story of YB Dato Ir Lo Khere Chiang", guest: "YB Dato Ir Lo Khere Chiang", description: "One of Sarawak's most prominent public figures sits down with GoTalk for a rare, unfiltered conversation about leadership, legacy, and the road ahead for our state." },
];

// ─── Hero Card (featured first episode) ──────────────────────────────────────

function HeroCard({ ep }: { ep: (typeof businessEpisodes)[0] }) {
  const videoId = videoIds[ep.epKey] ?? "";
  const ytUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined;

  return (
    <div className="flex flex-col lg:flex-row gap-0 overflow-hidden border border-white/10 bg-[#161616] mb-4">
      {/* Embed / Thumbnail */}
      <div className="w-full lg:w-2/5 flex-shrink-0">
        <YouTubeEmbed
          videoId={videoId}
          title={ep.title}
          badge={ep.ep}
          className="h-full"
        />
      </div>

      {/* Info */}
      <div className="group flex flex-col justify-center p-7 lg:p-9 flex-1">
        <p className="text-[10px] text-[#CC0000] font-semibold uppercase tracking-[0.25em] mb-2">
          {ep.guest}
        </p>
        <h3 className="font-[family-name:var(--font-bebas-neue)] text-3xl lg:text-4xl text-white tracking-wide leading-tight mb-3">
          {ep.title}
        </h3>
        <p className="text-sm text-white/45 leading-relaxed line-clamp-2 mb-5">
          {ep.description}
        </p>
        {ytUrl && (
          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold tracking-[0.2em] uppercase text-[#CC0000] hover:text-white transition-colors inline-flex items-center gap-2"
          >
            WATCH ON YOUTUBE →
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Episode Card ─────────────────────────────────────────────────────────────

function EpisodeCard({ ep }: { ep: (typeof businessEpisodes)[0] }) {
  const videoId = videoIds[ep.epKey] ?? "";
  const ytUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined;

  return (
    <div className="flex gap-4 p-4 border border-white/8 hover:border-[#CC0000]/40 hover:bg-[#1A1A1A] transition-all group">
      {/* Thumbnail with inline player */}
      <div className="w-40 flex-shrink-0">
        <YouTubeEmbed
          videoId={videoId}
          title={ep.title}
          badge={ep.ep}
          size="small"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center min-w-0">
        <p className="text-[10px] text-[#CC0000] font-semibold uppercase tracking-[0.2em] mb-1">
          {ep.guest}
        </p>
        {ytUrl ? (
          <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="group/title">
            <h3 className="font-[family-name:var(--font-bebas-neue)] text-lg text-white tracking-wide leading-tight group-hover/title:text-[#CC0000] transition-colors">
              {ep.title}
            </h3>
          </a>
        ) : (
          <h3 className="font-[family-name:var(--font-bebas-neue)] text-lg text-white tracking-wide leading-tight">
            {ep.title}
          </h3>
        )}
        <p className="mt-1 text-xs text-white/35 leading-relaxed line-clamp-1">
          {ep.description}
        </p>
      </div>
    </div>
  );
}

// ─── Playlist Section ─────────────────────────────────────────────────────────

function PlaylistSection({
  label,
  title,
  description,
  episodes,
  comingSoon = false,
}: {
  label: string;
  title: string;
  description: string;
  episodes?: typeof businessEpisodes;
  comingSoon?: boolean;
}) {
  const [featured, ...rest] = episodes ?? [];

  return (
    <div className="mb-20">
      <FadeUp>
        <div className="flex items-start gap-4 mb-8">
          <div className="flex-shrink-0 w-1 bg-[#CC0000] self-stretch mt-1" />
          <div>
            <p className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase mb-2">
              {label}
            </p>
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl lg:text-5xl text-white tracking-wide mb-3">
              {title}
            </h2>
            <p className="text-sm text-white/45 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </FadeUp>

      {comingSoon ? (
        <FadeIn>
          <div className="border border-white/8 bg-[#161616] p-12 text-center">
            <span className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white/20 tracking-widest">
              COMING SOON — We&apos;re bringing Sarawak&apos;s most celebrated
              voices to the GoTalk chair. Artists, athletes, and cultural icons.
              Watch this space.
            </span>
          </div>
        </FadeIn>
      ) : (
        <>
          {featured && (
            <FadeIn>
              <HeroCard ep={featured} />
            </FadeIn>
          )}
          {rest.length > 0 && (
            <StaggerList className="grid gap-2">
              {rest.map((ep) => (
                <StaggerItem key={ep.ep}>
                  <EpisodeCard ep={ep} />
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EpisodesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero header */}
        <div className="relative bg-[#111111] border-b border-white/10 overflow-hidden noise">
          <div className="absolute inset-0">
            <Image
              src="https://picsum.photos/seed/episodeshero/1920/500"
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
              <div className="flex items-center gap-3 mb-5">
                <DrawLine delay={0.2} className="w-8 h-px bg-[#CC0000]" />
                <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                  Show Library
                </span>
              </div>
            </FadeIn>
            <LineRevealScroll>
              <h1 className="font-[family-name:var(--font-bebas-neue)] text-6xl lg:text-8xl text-white tracking-wide mb-5">
                The Conversations
              </h1>
            </LineRevealScroll>
            <FadeUp delay={0.2}>
              <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
                Every episode is a window into the people, ideas, and stories
                that make Sarawak who she is. From boardrooms to ballot boxes —
                we go there.
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Playlists */}
        <div className="bg-[#111111] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <PlaylistSection
              label="Playlist"
              title="GoTalk Business — Sarawak Local Entrepreneurs"
              description="Real stories from the founders, operators, and risk-takers shaping Sarawak's business landscape. Unscripted. Unfiltered. Unforgettable."
              episodes={businessEpisodes}
            />
            <PlaylistSection
              label="Playlist"
              title="GoTalk Politics"
              description="Candid conversations with the people shaping Sarawak's future in the corridors of power. No spin. No script. Just straight talk."
              episodes={politicsEpisodes}
            />
            <PlaylistSection
              label="Playlist"
              title="GoTalk Icons"
              description="Sarawak's celebrated voices — artists, athletes, and cultural figures."
              comingSoon
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
