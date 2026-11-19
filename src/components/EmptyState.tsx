"use client";

import React, { useState } from "react";

interface EmptyStateProps {
  matchesCount: number;
  onViewMatches: () => void;
  onRefresh: () => Promise<void>;
}

export function EmptyState({
  matchesCount,
  onViewMatches,
  onRefresh,
}: EmptyStateProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshLabel, setRefreshLabel] = useState("Check Again");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshLabel("Checking Nearby...");

    try {
      await onRefresh();
      setRefreshLabel("Still Up to Date!");
    } finally {
      setTimeout(() => {
        setRefreshLabel("Check Again");
        setIsRefreshing(false);
      }, 1200);
    }
  };

  return (
    <div className="relative w-full rounded-[28px] bg-[#E9E0FF]/35 border-2 border-ink shadow-tactile p-6 flex flex-col items-center text-center overflow-hidden my-auto">
      {/* Ambient subtle sparkle bubbles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-secondary-container/40 blur-xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-primary-fixed/40 blur-xl pointer-events-none" />

      {/* Heart Character / Sleeping Coy Character SVG */}
      <div className="relative my-2 flex items-center justify-center w-36 h-36">
        <span className="absolute w-32 h-32 rounded-full border-2 border-ink/15 animate-ping opacity-60" />
        <span className="absolute w-28 h-28 rounded-full bg-secondary-container/50" />

        <svg
          className="relative z-10 w-28 h-28 drop-shadow-[0_4px_0_rgba(33,27,41,0.2)]"
          fill="none"
          viewBox="0 0 160 160"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Behind Moon / Shadow Bubble */}
          <circle
            cx="68"
            cy="80"
            r="46"
            fill="#FFFFFF"
            stroke="#211B29"
            strokeWidth="6"
          />

          {/* Coy Heart Character Resting */}
          <g className="origin-center transition-transform hover:scale-105">
            <path
              d="M96 42C74 42 66 64 66 64C66 64 58 42 36 42C16 42 2 58 2 82C2 110 50 136 66 148C82 136 130 110 130 82C130 58 116 42 96 42Z"
              fill="#E7DEFD"
              stroke="#211B29"
              strokeLinejoin="round"
              strokeWidth="7"
              transform="translate(18, -4)"
            />
            {/* Resting / Satisfied Sleep Eyes */}
            <path
              d="M72 74C72 74 76 80 82 80C88 80 92 74 92 74"
              stroke="#211B29"
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d="M102 74C102 74 106 80 112 80C118 80 122 74 122 74"
              stroke="#211B29"
              strokeLinecap="round"
              strokeWidth="5"
            />
            {/* Shy Soft Blush Cheeks */}
            <ellipse
              cx="71"
              cy="86"
              rx="6"
              ry="4"
              fill="#FF347D"
              opacity="0.85"
            />
            <ellipse
              cx="123"
              cy="86"
              rx="6"
              ry="4"
              fill="#FF347D"
              opacity="0.85"
            />
            {/* Content Smile */}
            <path
              d="M91 89C94 95 100 95 103 89"
              stroke="#211B29"
              strokeLinecap="round"
              strokeWidth="4.5"
            />
          </g>

          {/* Playful Zzz floating indicators */}
          <text
            x="122"
            y="44"
            fill="#211B29"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontSize="14"
            fontWeight="800"
            opacity="0.85"
          >
            z
          </text>
          <text
            x="136"
            y="32"
            fill="#FF347D"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontSize="18"
            fontWeight="900"
          >
            Z
          </text>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col gap-1 px-2 mt-1">
        <h2 className="text-xl font-extrabold text-ink tracking-tight">
          You&apos;ve seen everyone for now!
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed max-w-[280px] mx-auto">
          There are no more profiles available in this demo feed. You can explore your mutual matches or return to check the feed.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-2.5 mt-5">
        {/* Primary Matches CTA */}
        <button
          type="button"
          onClick={onViewMatches}
          className="w-full h-12 rounded-full bg-coy-pink text-white text-sm font-bold flex items-center justify-center gap-2 border-2 border-ink shadow-tactile transition-all hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-tactile-active"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <span>View Matches ({matchesCount})</span>
        </button>

        {/* Secondary Refresh Button */}
        <button
          type="button"
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="w-full h-11 rounded-full bg-white text-ink text-xs font-bold flex items-center justify-center gap-2 border-2 border-ink shadow-tactile transition-all hover:bg-surface-container-low active:translate-x-[2px] active:translate-y-[2px] active:shadow-tactile-active disabled:opacity-75"
        >
          <span
            className={`material-symbols-outlined text-[18px] text-ink transition-transform duration-500 ${
              isRefreshing ? "rotate-180" : ""
            }`}
          >
            refresh
          </span>
          <span>{refreshLabel}</span>
        </button>
      </div>
    </div>
  );
}
