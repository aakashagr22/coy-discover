"use client";

import React from "react";

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export function ActionButtons({ onPass, onLike, disabled = false }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-8 py-3 relative">
      {/* Pass Action Button */}
      <button
        type="button"
        aria-label="Pass Profile"
        disabled={disabled}
        onClick={onPass}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-ink shadow-tactile transition-all hover:bg-rose-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-tactile-active focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
      >
        <span className="material-symbols-outlined text-[32px] text-ink group-hover:text-rose-600 transition-colors">
          close
        </span>
      </button>

      {/* Like Action Button */}
      <button
        type="button"
        aria-label="Like Profile"
        disabled={disabled}
        onClick={onLike}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-coy-pink text-white border-2 border-ink shadow-tactile transition-all hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-tactile-active focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
      >
        <span
          className="material-symbols-outlined text-[34px] text-white transition-transform group-hover:scale-110"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </button>
    </div>
  );
}
