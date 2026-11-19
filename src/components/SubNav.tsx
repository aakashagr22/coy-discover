"use client";

import React from "react";

interface SubNavProps {
  activeView: "feed" | "matches";
  matchesCount: number;
  onViewChange: (view: "feed" | "matches") => void;
}

export function SubNav({ activeView, matchesCount, onViewChange }: SubNavProps) {
  return (
    <div className="flex items-center justify-center pt-2 pb-3">
      <div className="inline-flex p-1 bg-surface-container rounded-full border-[1.5px] border-ink shadow-tactile-sm">
        <button
          type="button"
          onClick={() => onViewChange("feed")}
          className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeView === "feed"
              ? "bg-coy-pink text-white shadow-sm"
              : "text-ink hover:bg-secondary-fixed/50"
          }`}
        >
          Discover
        </button>
        <button
          type="button"
          onClick={() => onViewChange("matches")}
          className={`flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeView === "matches"
              ? "bg-coy-pink text-white shadow-sm"
              : "text-ink hover:bg-secondary-fixed/50"
          }`}
        >
          <span>Matches</span>
          <span
            className={`flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-black border border-ink ${
              activeView === "matches"
                ? "bg-white text-ink"
                : "bg-secondary-fixed text-ink"
            }`}
          >
            {matchesCount}
          </span>
        </button>
      </div>
    </div>
  );
}
