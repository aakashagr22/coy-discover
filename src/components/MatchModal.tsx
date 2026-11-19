"use client";

import React from "react";
import { ProfileDTO } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface MatchModalProps {
  matchedProfile: ProfileDTO | null;
  onContinue: () => void;
  onViewMatches: () => void;
}

export function MatchModal({
  matchedProfile,
  onContinue,
  onViewMatches,
}: MatchModalProps) {
  if (!matchedProfile) return null;

  // Find common or prominent interests to display in badge
  const displayInterests = matchedProfile.interests.slice(0, 2).join(" & ");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191522]/80 backdrop-blur-md">
        {/* Floating Confetti Shapes & Doodles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <span className="absolute top-[12%] left-[15%] w-3 h-3 rounded-full bg-coy-pink animate-bounce opacity-90 shadow-[1px_1px_0px_#211B29]" />
          <span className="absolute top-[20%] right-[18%] w-4 h-4 rounded-md rotate-12 bg-secondary-fixed opacity-90 shadow-[1px_1px_0px_#211B29]" />
          <span className="absolute top-[32%] left-[8%] w-2.5 h-6 rounded-full -rotate-45 bg-[#FFD166] opacity-95" />
          <span className="absolute top-[15%] right-[32%] w-3 h-3 rounded-full bg-[#FFD166] opacity-85" />
          <span className="absolute bottom-[28%] left-[12%] w-4 h-2 rounded-full rotate-45 bg-coy-pink opacity-90" />
          <span className="absolute bottom-[22%] right-[10%] w-3.5 h-3.5 rounded-md -rotate-12 bg-secondary-fixed opacity-90 shadow-[1px_1px_0px_#211B29]" />

          {/* SVG floating hearts */}
          <svg
            className="absolute top-[8%] left-[28%] w-8 h-8 text-coy-pink animate-pulse"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg
            className="absolute bottom-[35%] left-[5%] w-7 h-7 text-secondary-fixed opacity-80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-[364px] bg-[#FFFCFE] rounded-[32px] p-6 flex flex-col items-center text-center z-10 border-2 border-ink shadow-[6px_6px_0px_#211B29]"
        >
          {/* Main Headline & Subtitle */}
          <h2 className="text-3xl font-extrabold text-ink tracking-tight leading-none mb-1">
            It&apos;s a Match!
          </h2>
          <p className="text-sm text-on-surface-variant font-medium mb-5 max-w-[240px]">
            You and <span className="font-bold text-ink">{matchedProfile.name}</span> liked each other&apos;s vibe.
          </p>

          {/* Overlapping Dual Avatar Bubbles */}
          <div className="relative flex items-center justify-center w-full my-2 mb-6">
            {/* Left: User Avatar (Alex) */}
            <div className="relative z-10 -mr-4 w-24 h-24 rounded-full p-[3px] bg-secondary-fixed border-2 border-ink shadow-tactile">
              <div className="w-full h-full rounded-full overflow-hidden bg-surface-container">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center Floating Heart Mark */}
            <div className="absolute z-30 flex items-center justify-center w-11 h-11 rounded-full bg-coy-pink text-white border-2 border-ink shadow-tactile-sm -translate-y-1">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>

            {/* Right: Matched Profile Portrait */}
            <div className="relative z-20 w-24 h-24 rounded-full p-[3px] bg-coy-pink border-2 border-ink shadow-tactile">
              <div className="w-full h-full rounded-full overflow-hidden bg-surface-container">
                <img
                  src={matchedProfile.photoUrl}
                  alt={matchedProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Matched Profile Bio Card Preview */}
          <div className="w-full bg-surface-container-low rounded-2xl p-3 border border-ink/20 shadow-tactile-sm flex flex-col items-center gap-1 mb-5">
            <div className="flex items-center gap-1.5 text-base font-bold text-ink">
              <span>
                {matchedProfile.name}, {matchedProfile.age}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-coy-pink mx-0.5" />
              <span className="text-xs text-on-surface-variant font-medium truncate max-w-[140px]">
                {matchedProfile.cityOrCollege.split("•")[0]}
              </span>
            </div>

            {/* Shared Spark Badge */}
            {displayInterests && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coy-pink text-white border border-ink shadow-[1.5px_1.5px_0px_#211B29] mt-0.5">
                <span className="material-symbols-outlined text-[14px]">
                  auto_awesome
                </span>
                <span className="text-[11px] font-bold tracking-tight">
                  Both into {displayInterests}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            {/* Primary Action: Continue Discover */}
            <button
              type="button"
              onClick={onContinue}
              className="w-full h-12 rounded-full bg-coy-pink text-white text-base font-bold tracking-tight border-2 border-ink shadow-tactile active:translate-x-[2px] active:translate-y-[2px] active:shadow-tactile-active transition-all flex items-center justify-center gap-1.5 hover:brightness-105"
            >
              <span>Continue Discover</span>
              <span className="material-symbols-outlined text-[20px]">
                local_fire_department
              </span>
            </button>

            {/* Secondary Action: View Matches */}
            <button
              type="button"
              onClick={onViewMatches}
              className="w-full h-11 rounded-full bg-secondary-container text-ink text-sm font-bold border-2 border-ink shadow-tactile-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-tactile-active transition-all flex items-center justify-center gap-1.5 hover:bg-secondary-fixed"
            >
              <span
                className="material-symbols-outlined text-[18px] text-coy-pink"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <span>View Matches</span>
            </button>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            aria-label="Dismiss Match Modal"
            onClick={onContinue}
            className="mt-3 p-1 text-on-surface-variant hover:text-ink transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
