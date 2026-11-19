"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ProfileDTO, MatchItemDTO, SwipeResponse } from "@/lib/types";
import { Header } from "@/components/Header";
import { SubNav } from "@/components/SubNav";
import { CardStack } from "@/components/CardStack";
import { MatchModal } from "@/components/MatchModal";
import { MatchesView } from "@/components/MatchesView";
import { EmptyState } from "@/components/EmptyState";
import { BlankHome } from "@/components/BlankHome";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"home" | "discover">("discover");
  const [activeDiscoverView, setActiveDiscoverView] = useState<"feed" | "matches">("feed");
  const [profiles, setProfiles] = useState<ProfileDTO[]>([]);
  const [matches, setMatches] = useState<MatchItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [activeMatch, setActiveMatch] = useState<ProfileDTO | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Feed Profiles
  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch("/feed");
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
    }
  }, []);

  // Fetch Mutual Matches
  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch("/matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error("Failed to load matches:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await Promise.all([fetchFeed(), fetchMatches()]);
      setIsLoading(false);
    }
    init();
  }, [fetchFeed, fetchMatches]);

  // Handle Swipe Action with optimistic update and rollback on failure
  const handleSwipe = async (action: "like" | "pass", swipedProfile: ProfileDTO) => {
    setIsSwiping(true);
    setErrorMessage(null);

    // Optimistically advance card stack
    setProfiles((prev) => prev.filter((p) => p.userId !== swipedProfile.userId));

    try {
      const res = await fetch("/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: swipedProfile.userId,
          action,
        }),
      });

      if (res.ok) {
        const data: SwipeResponse = await res.json();

        // If mutual match occurred, trigger match celebration modal
        if (data.match && data.matchedProfile) {
          setActiveMatch(data.matchedProfile);
          await fetchMatches();
        }
      } else {
        console.error("Swipe submission returned non-200:", res.status);
        // Rollback optimistic removal so profile is not permanently lost
        setProfiles((prev) => [swipedProfile, ...prev]);
        setErrorMessage("Swipe failed to save. Restoring profile...");
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error submitting swipe:", err);
      // Rollback optimistic removal on network failure
      setProfiles((prev) => [swipedProfile, ...prev]);
      setErrorMessage("Network issue. Restoring profile...");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsSwiping(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface relative">
      {/* Fixed Top Brand Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* Ephemeral Error Notification */}
      {errorMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold shadow-tactile border border-ink animate-bounce">
          {errorMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-16 px-4 pb-6">
        {currentTab === "home" ? (
          /* Blank Home Tab */
          <BlankHome />
        ) : (
          /* Discover Experience */
          <div className="flex-1 flex flex-col">
            {/* Sub-Navigation: Discover | Matches (N) */}
            <SubNav
              activeView={activeDiscoverView}
              matchesCount={matches.length}
              onViewChange={(view) => setActiveDiscoverView(view)}
            />

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-coy-pink border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-xs font-bold text-on-surface-variant">
                  Loading discovery feed...
                </p>
              </div>
            ) : activeDiscoverView === "matches" ? (
              /* Matches List View */
              <MatchesView
                matches={matches}
                onBackToDiscover={() => setActiveDiscoverView("feed")}
              />
            ) : profiles.length > 0 ? (
              /* Card Stack Swiping Feed */
              <CardStack
                profiles={profiles}
                onSwipe={handleSwipe}
                isProcessing={isSwiping}
              />
            ) : (
              /* Empty Feed State */
              <EmptyState
                matchesCount={matches.length}
                onViewMatches={() => setActiveDiscoverView("matches")}
                onRefresh={fetchFeed}
              />
            )}
          </div>
        )}
      </main>

      {/* "It's a Match!" Celebration Modal */}
      <MatchModal
        matchedProfile={activeMatch}
        onContinue={() => setActiveMatch(null)}
        onViewMatches={() => {
          setActiveMatch(null);
          setCurrentTab("discover");
          setActiveDiscoverView("matches");
        }}
      />
    </div>
  );
}
