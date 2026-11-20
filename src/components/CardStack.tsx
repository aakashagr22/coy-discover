"use client";

import React, { useState } from "react";
import { ProfileDTO } from "@/lib/types";
import { ProfileCard } from "./ProfileCard";
import { ActionButtons } from "./ActionButtons";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";

interface CardStackProps {
  profiles: ProfileDTO[];
  onSwipe: (action: "like" | "pass", profile: ProfileDTO) => void;
  isProcessing?: boolean;
}

export function CardStack({ profiles, onSwipe, isProcessing = false }: CardStackProps) {
  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isAnimatingOut || isProcessing) return;

    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      // Swiped Right -> Like
      await triggerExit("like");
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      // Swiped Left -> Pass
      await triggerExit("pass");
    } else {
      // Snap back to center
      animate(x, 0, { type: "spring", stiffness: 400, damping: 25 });
    }
  };

  const triggerExit = async (action: "like" | "pass") => {
    if (isAnimatingOut || !currentProfile) return;
    setIsAnimatingOut(true);

    const targetX = action === "like" ? 600 : -600;
    const targetRotate = action === "like" ? 25 : -25;

    // Smooth exit animation
    await animate(x, targetX, {
      duration: 0.28,
      ease: [0.32, 0, 0.67, 0],
    });

    onSwipe(action, currentProfile);

    // Reset position for next top card
    x.set(0);
    setIsAnimatingOut(false);
  };

  if (!currentProfile) {
    return null;
  }

  return (
    <div className="flex flex-col w-full relative">
      {/* Stack Container */}
      <div className="relative w-full mt-1 mb-2">
        {/* Background stack hint card 2 (deepest) */}
        {profiles.length > 2 && (
          <div className="absolute -bottom-2.5 left-3 right-3 h-20 rounded-[28px] bg-secondary-fixed/70 border-2 border-ink shadow-tactile -z-20 rotate-1" />
        )}

        {/* Background stack hint card 1 (just behind top) - blank tactile card layer */}
        {nextProfile && (
          <div className="absolute -bottom-1.5 left-1.5 right-1.5 h-20 rounded-[28px] bg-surface-container border-2 border-ink shadow-tactile -z-10 -rotate-0.5" />
        )}

        {/* Active Top Swipable Card with Drag Gestures */}
        <motion.div
          key={currentProfile.userId || currentProfile.id}
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          className="relative w-full cursor-grab active:cursor-grabbing touch-none z-10"
        >
          <ProfileCard
            key={currentProfile.userId || currentProfile.id}
            profile={currentProfile}
            dragX={x}
            isTopCard={true}
          />
        </motion.div>
      </div>

      {/* Tactile Control Buttons (for desktop and direct taps) */}
      <ActionButtons
        onPass={() => triggerExit("pass")}
        onLike={() => triggerExit("like")}
        disabled={isAnimatingOut || isProcessing}
      />
    </div>
  );
}
