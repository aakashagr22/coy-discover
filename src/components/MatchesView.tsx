"use client";

import React from "react";
import { MatchItemDTO } from "@/lib/types";

interface MatchesViewProps {
  matches: MatchItemDTO[];
  onBackToDiscover: () => void;
}

function MatchCard({ match }: { match: MatchItemDTO }) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="bg-white rounded-2xl p-3.5 border-2 border-ink shadow-tactile relative overflow-hidden transition-all hover:translate-y-[-1px]">
      <div className="flex gap-3 items-center">
        {/* Thumbnail */}
        <div className="relative shrink-0 w-20 h-24 rounded-xl overflow-hidden bg-surface-container border border-ink flex items-center justify-center">
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary-fixed/50 p-1 text-center">
              <span
                className="material-symbols-outlined text-[28px] text-coy-pink/70"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person
              </span>
              <span className="text-[10px] font-bold text-ink truncate max-w-[70px]">
                {match.profile.name}
              </span>
            </div>
          ) : (
            <img
              src={match.profile.photoUrl}
              alt={match.profile.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          )}
          <span className="absolute bottom-1 right-1 p-1 bg-white/95 rounded-full flex items-center justify-center border border-ink/20 shadow-sm">
            <span
              className="material-symbols-outlined text-[13px] text-coy-pink"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </span>
        </div>

        {/* Info Column */}
        <div className="flex flex-col flex-1 min-w-0 justify-between">
          <div>
            <h2 className="text-base font-extrabold text-ink truncate">
              {match.profile.name}, {match.profile.age}
            </h2>
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5 truncate font-medium">
              <span className="material-symbols-outlined text-[14px] shrink-0 text-coy-pink">
                location_on
              </span>
              <span className="truncate">{match.profile.cityOrCollege}</span>
            </p>
          </div>

          {/* Shared Passions */}
          <div className="flex flex-wrap gap-1 mt-2">
            {match.profile.interests.slice(0, 2).map((interest, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border border-ink ${
                  idx === 0
                    ? "bg-coy-pink text-white"
                    : "bg-secondary-fixed text-ink"
                }`}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Action / Status Row */}
      <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-ink/10">
        <span className="inline-flex items-center gap-1 text-coy-pink text-[11px] font-bold">
          <span
            className="material-symbols-outlined text-[13px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          Mutual Match
        </span>
        <span className="text-[10px] text-on-surface-variant">
          {new Date(match.matchedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

export function MatchesView({ matches, onBackToDiscover }: MatchesViewProps) {
  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Navigation & Back Row */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onBackToDiscover}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-ink text-xs font-bold border-2 border-ink shadow-tactile-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-tactile-active transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Discover</span>
        </button>
      </div>

      {/* Section Title & Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-ink">Mutual Matches</h1>
          <span className="px-2 py-0.5 rounded-full bg-coy-pink text-white text-xs font-bold border border-ink shadow-tactile-active">
            {matches.length}
          </span>
        </div>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="w-full bg-[#E9E0FF]/35 rounded-[28px] border-2 border-ink shadow-tactile p-6 flex flex-col items-center text-center my-6">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-ink flex items-center justify-center text-coy-pink shadow-tactile-sm mb-3">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
          <h3 className="text-lg font-bold text-ink mb-1">No matches yet</h3>
          <p className="text-xs text-on-surface-variant max-w-[240px] leading-relaxed mb-4">
            Keep exploring profiles on the Discover feed. When someone you like likes you back, they will appear here!
          </p>
          <button
            type="button"
            onClick={onBackToDiscover}
            className="px-5 py-2 rounded-full bg-coy-pink text-white text-xs font-bold border-2 border-ink shadow-tactile-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-tactile-active transition-all"
          >
            Start Discovering
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
