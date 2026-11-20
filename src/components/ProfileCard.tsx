"use client";

import React from "react";
import Image from "next/image";
import { ProfileDTO } from "@/lib/types";
import { motion, MotionValue, useTransform } from "framer-motion";

interface ProfileCardProps {
  profile: ProfileDTO;
  dragX?: MotionValue<number>;
  isTopCard?: boolean;
}

function SwipeStamps({ dragX }: { dragX: MotionValue<number> }) {
  const likeOpacity = useTransform(dragX, [20, 100], [0, 1]);
  const passOpacity = useTransform(dragX, [-20, -100], [0, 1]);

  return (
    <>
      {/* LIKE STAMP */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-1/4 left-6 -rotate-12 px-4 py-1.5 rounded-2xl bg-emerald-500 text-white border-[2.5px] border-ink shadow-tactile pointer-events-none z-30"
      >
        <span className="font-extrabold text-[22px] tracking-wider uppercase">
          LIKE ♥
        </span>
      </motion.div>

      {/* PASS STAMP */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-1/4 right-6 rotate-12 px-4 py-1.5 rounded-2xl bg-rose-500 text-white border-[2.5px] border-ink shadow-tactile pointer-events-none z-30"
      >
        <span className="font-extrabold text-[22px] tracking-wider uppercase">
          PASS ✕
        </span>
      </motion.div>
    </>
  );
}

// Emoji mapping for interest tags to match the Stitch design vibe
const INTEREST_EMOJIS: Record<string, string> = {
  Ceramics: "🏺",
  "Modern Art": "🏛️",
  "Natural Wine": "🍷",
  "Indie Cinema": "🎬",
  "Vinyl Records": "🎶",
  Architecture: "🏛️",
  "Specialty Coffee": "☕",
  Cycling: "🚲",
  Typography: "✍️",
  Jazz: "🎷",
  Pottery: "🏺",
  "Film Noir": "🎞️",
  Sourdough: "🍞",
  Thrifting: "✨",
  "Analogue Photography": "📷",
  Bouldering: "🧗",
  Botany: "🌿",
  "Vintage Fashion": "👗",
  "Natural Wine Pairing": "🍇",
  Cooking: "🍳",
  Bookshops: "📚",
  Illustration: "🎨",
  "Exhibition Design": "🖼️",
  "Set Design": "🎭",
  Zines: "📰",
};

export function ProfileCard({ profile, dragX, isTopCard = true }: ProfileCardProps) {
  const [imageError, setImageError] = React.useState(false);

  // Reset image error state whenever the active profile or its photoUrl changes
  React.useEffect(() => {
    setImageError(false);
  }, [profile.id, profile.userId, profile.photoUrl]);

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden bg-white border-2 border-ink shadow-tactile-lg select-none">
      {/* Top Image Area */}
      <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary-fixed/50 p-6 text-center text-ink select-none">
            <span
              className="material-symbols-outlined text-[64px] text-coy-pink/70 mb-2"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person
            </span>
            <span className="font-extrabold text-lg text-ink">{profile.name}</span>
            <span className="text-xs text-on-surface-variant font-medium mt-1">Photo currently unavailable</span>
          </div>
        ) : (
          <Image
            src={profile.photoUrl}
            alt={`${profile.name}'s profile photo`}
            fill
            sizes="(max-width: 430px) 100vw, 400px"
            priority={isTopCard}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        )}

        {/* Visual Swipe Reaction Stamps (revealed on drag) */}
        {isTopCard && dragX && <SwipeStamps dragX={dragX} />}
      </div>

      {/* Lower Profile Content Sheet */}
      <div className="p-4 bg-white border-t-2 border-ink flex flex-col gap-2.5">
        {/* Name and Age */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-ink tracking-tight">
            {profile.name}, {profile.age}
          </h2>
        </div>

        {/* Location & College */}
        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px] text-coy-pink">
            location_on
          </span>
          <span>{profile.cityOrCollege}</span>
        </div>

        {/* Bio Box */}
        <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40">
          <p className="text-sm text-ink leading-relaxed font-medium">
            {profile.bio}
          </p>
        </div>

        {/* Passions & Quirks (Interests) */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-on-surface-variant">
            Passions &amp; Quirks
          </span>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-ink border-[1.5px] border-ink shadow-[1.5px_1.5px_0px_#211B29] text-xs font-bold"
              >
                <span>{INTEREST_EMOJIS[interest] || "✨"}</span>
                <span>{interest}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
