"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  videoId: string;       // YouTube video ID — empty string = no video yet
  title: string;
  thumbnail?: string;    // Custom thumbnail URL (falls back to YouTube's)
  badge?: string;        // e.g. "EP 11"
  duration?: string;     // e.g. "45:32"
  size?: "default" | "small";
  className?: string;
}

export default function YouTubeEmbed({
  videoId,
  title,
  thumbnail,
  badge,
  duration,
  size = "default",
  className = "",
}: Props) {
  const [playing, setPlaying] = useState(false);

  const hasVideo = videoId.length > 0;
  const ytThumb = hasVideo ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : null;
  const thumbSrc = thumbnail || ytThumb;

  const playIconSize = size === "small"
    ? "w-8 h-8 border border-white/25"
    : "w-16 h-16 border-2 border-white/40";

  const triangleSize = size === "small"
    ? "border-t-[5px] border-b-[5px] border-l-[8px]"
    : "border-t-[9px] border-b-[9px] border-l-[15px]";

  // ── Playing state — show iframe ────────────────────────────────────────────
  if (playing && hasVideo) {
    return (
      <div className={`relative aspect-video bg-black ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  // ── Thumbnail / preview state ──────────────────────────────────────────────
  return (
    <div
      className={`relative aspect-video bg-[#1A1A1A] overflow-hidden group ${hasVideo ? "cursor-pointer" : ""} ${className}`}
      onClick={() => hasVideo && setPlaying(true)}
      role={hasVideo ? "button" : undefined}
      aria-label={hasVideo ? `Play ${title}` : undefined}
      tabIndex={hasVideo ? 0 : undefined}
      onKeyDown={(e) => e.key === "Enter" && hasVideo && setPlaying(true)}
    >
      {/* Thumbnail image */}
      {thumbSrc && (
        <Image
          src={thumbSrc}
          alt={title}
          fill
          className={`object-cover transition-all duration-700 ${
            hasVideo
              ? "opacity-60 group-hover:opacity-85 group-hover:scale-105"
              : "opacity-30"
          }`}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/70 via-transparent to-transparent" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className={`${playIconSize} rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
            hasVideo
              ? "group-hover:border-[#CC0000] group-hover:bg-[#CC0000] group-hover:scale-110"
              : "opacity-20"
          }`}
        >
          <div
            className={`w-0 h-0 border-t-transparent border-b-transparent ml-1 ${triangleSize} ${
              hasVideo ? "border-l-white" : "border-l-white/50"
            }`}
          />
        </div>
      </div>

      {/* "Coming Soon" if no video */}
      {!hasVideo && (
        <div className="absolute inset-0 flex items-end justify-center pb-5 z-20">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/25 border border-white/10 px-3 py-1">
            Video Coming Soon
          </span>
        </div>
      )}

      {/* Episode badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10 bg-[#CC0000] text-white text-xs font-bold tracking-widest uppercase px-3 py-1">
          {badge}
        </div>
      )}

      {/* Duration */}
      {duration && hasVideo && (
        <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white text-xs font-mono px-2 py-0.5 backdrop-blur-sm">
          {duration}
        </div>
      )}
    </div>
  );
}
