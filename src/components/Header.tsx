"use client";

import React from "react";
import Image from "next/image";

interface HeaderProps {
  currentTab: "home" | "discover";
  onTabChange: (tab: "home" | "discover") => void;
}

export function Header({ currentTab, onTabChange }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full max-w-[430px] z-40 bg-surface/90 backdrop-blur-xl border-b border-[#211B29]/5 shadow-sm pt-safe">
      <div className="h-16 px-4 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-coy-pink flex items-center justify-center text-white border-[1.5px] border-ink shadow-[1.5px_1.5px_0px_#211B29]">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
          <span className="font-extrabold text-2xl tracking-tighter text-ink lowercase">
            coy
          </span>
        </div>

        {/* Tab Switcher: Home vs Discover */}
        <div className="flex items-center p-1 bg-surface-container rounded-full border border-ink/20 shadow-sm">
          <button
            type="button"
            onClick={() => onTabChange("home")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentTab === "home"
                ? "bg-white text-coy-pink shadow-[1px_1px_3px_rgba(0,0,0,0.1)] border border-ink/10"
                : "text-on-surface-variant hover:text-ink"
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onTabChange("discover")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentTab === "discover"
                ? "bg-white text-coy-pink shadow-[1px_1px_3px_rgba(0,0,0,0.1)] border border-ink/10"
                : "text-on-surface-variant hover:text-ink"
            }`}
          >
            Discover
          </button>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center shrink-0">
          <div className="relative flex items-center justify-center">
            <div className="p-[2px] rounded-full bg-secondary-container border border-ink/20">
              <Image
                alt="Your profile avatar (Alex)"
                className="w-8 h-8 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                width={32}
                height={32}
              />
            </div>
            <span
              className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-coy-pink rounded-full ring-2 ring-white flex items-center justify-center"
              title="Privacy Guard Active"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
