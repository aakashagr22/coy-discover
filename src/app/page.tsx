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
  const [feedError, setFeedError] = useState<string | null>(null);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Feed Profiles
  const fetchFeed = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/feed");
      if (!res.ok) {
        const errorText = `Unable to load feed (status ${res.status})`;
        setFeedError(errorText);
        return false;
      }

      const data = await res.json();
      if (!data || !Array.isArray(data.profiles)) {
        setFeedError("Invalid feed data format received from server");
        return false;
      }

      // Successful response: update profiles and clear error
      setProfiles(data.profiles);
      setFeedError(null);
      return true;
    } catch (err) {
      console.error("Failed to load feed:", err);
      const networkError = "Network error while connecting to feed";
      setFeedError(networkError);
      return false;
    }
  }, []);

  // Fetch Mutual Matches
  const fetchMatches = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/matches");
      if (!res.ok) {
        const errorText = `Unable to load matches (status ${res.status})`;
        setMatchesError(errorText);
        return false;
      }

      const data = await res.json();
      if (!data || !Array.isArray(data.matches)) {
        setMatchesError("Invalid matches data format received from server");
        return false;
      }

      // Successful response: update matches and clear error
      setMatches(data.matches);
      setMatchesError(null);
      return true;
    } catch (err) {
      console.error("Failed to load matches:", err);
      const networkError = "Network error while loading matches";
      setMatchesError(networkError);
      return false;
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

  // Handle Swipe Action with optimistic update and safe server reconciliation on failure
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
        return;
      }

      // Handle non-200 responses with safe server reconciliation (never blindly restore swiped profiles)
      console.warn(`POST /swipe failed with status ${res.status}`);

      if (res.status === 409) {
        // Profile has already been recorded; reconcile directly with server
        setErrorMessage("Profile already swiped. Reconciling feed...");
        await fetchFeed();
        setTimeout(() => setErrorMessage(null), 3000);
      } else if (res.status === 404) {
        // Target profile not found; reconcile feed
        setErrorMessage("Profile not found. Reconciling feed...");
        await fetchFeed();
        setTimeout(() => setErrorMessage(null), 3000);
      } else {
        // 500 or other unexpected status: operation may have committed before failure
        setErrorMessage("Server error during swipe. Reconciling feed...");
        const reconciled = await fetchFeed();
        if (!reconciled) {
          // If reconciliation fails, preserve current feed and display unconfirmed warning
          setErrorMessage("Unable to confirm swipe status. Please check your connection.");
        }
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } catch (err) {
      console.error("Network error during swipe:", err);
      // Operation may have committed before network dropped; reconcile directly
      setErrorMessage("Network issue during swipe. Reconciling feed...");
      const reconciled = await fetchFeed();
      if (!reconciled) {
        // Preserve current feed without restoring already-swiped cards
        setErrorMessage("Network disconnected. Swipe outcome could not be verified.");
      }
      setTimeout(() => setErrorMessage(null), 4000);
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

            {/* Non-blocking error banner when cached profiles exist and a feed refresh fails */}
            {feedError && profiles.length > 0 && activeDiscoverView === "feed" && (
              <div className="mb-3 px-3.5 py-2 rounded-2xl bg-[#FFEAEB] border border-ink text-ink text-xs font-bold flex items-center justify-between shadow-tactile-sm">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">
                    sync_problem
                  </span>
                  <span className="truncate">{feedError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchFeed()}
                  className="ml-2 px-2.5 py-1 rounded-full bg-coy-pink text-white text-[11px] font-bold border border-ink shadow-tactile-active shrink-0 active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Retry
                </button>
              </div>
            )}

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
                error={matchesError}
                onRetry={fetchMatches}
              />
            ) : feedError && profiles.length === 0 ? (
              /* Feed API Error State (When no profiles are cached) */
              <div className="w-full bg-[#FFEAEB] rounded-[28px] border-2 border-ink shadow-tactile p-6 flex flex-col items-center text-center my-auto">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-ink flex items-center justify-center text-rose-600 shadow-tactile-sm mb-3">
                  <span className="material-symbols-outlined text-[28px]">
                    cloud_off
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink mb-1">Couldn&apos;t load feed</h3>
                <p className="text-xs text-on-surface-variant max-w-[240px] leading-relaxed mb-4">
                  {feedError}. Please check your connection and try again.
                </p>
                <button
                  type="button"
                  onClick={() => fetchFeed()}
                  className="px-5 py-2 rounded-full bg-coy-pink text-white text-xs font-bold border-2 border-ink shadow-tactile-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-tactile-active transition-all"
                >
                  Retry
                </button>
              </div>
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
                error={feedError}
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
