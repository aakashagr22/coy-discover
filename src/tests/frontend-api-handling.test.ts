import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Frontend Feed & Matches API Error Handling Contracts", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // Reusable helper simulating page.tsx fetchFeed logic
  async function simulateFetchFeed(
    currentProfiles: any[],
    setProfiles: (p: any[]) => void,
    setFeedError: (e: string | null) => void
  ): Promise<boolean> {
    try {
      const res = await fetch("/feed");
      if (!res.ok) {
        setFeedError(`Unable to load feed (status ${res.status})`);
        return false;
      }
      const data = await res.json();
      if (!data || !Array.isArray(data.profiles)) {
        setFeedError("Invalid feed data format received from server");
        return false;
      }
      setProfiles(data.profiles);
      setFeedError(null);
      return true;
    } catch (err) {
      setFeedError("Network error while connecting to feed");
      return false;
    }
  }

  // Reusable helper simulating page.tsx fetchMatches logic
  async function simulateFetchMatches(
    setMatches: (m: any[]) => void,
    setMatchesError: (e: string | null) => void
  ): Promise<boolean> {
    try {
      const res = await fetch("/matches");
      if (!res.ok) {
        setMatchesError(`Unable to load matches (status ${res.status})`);
        return false;
      }
      const data = await res.json();
      if (!data || !Array.isArray(data.matches)) {
        setMatchesError("Invalid matches data format received from server");
        return false;
      }
      setMatches(data.matches);
      setMatchesError(null);
      return true;
    } catch (err) {
      setMatchesError("Network error while loading matches");
      return false;
    }
  }

  it("handles GET /feed returning 200 with profiles", async () => {
    const mockProfiles = [{ id: "p1", userId: "u1", name: "Maya", age: 24 }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ profiles: mockProfiles, remainingCount: 1 }),
    });

    let profiles: any[] = [];
    let feedError: string | null = "stale error";

    const ok = await simulateFetchFeed(
      profiles,
      (p) => { profiles = p; },
      (e) => { feedError = e; }
    );

    expect(ok).toBe(true);
    expect(profiles).toEqual(mockProfiles);
    expect(feedError).toBeNull();
  });

  it("handles GET /feed returning 200 with an empty list", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ profiles: [], remainingCount: 0 }),
    });

    let profiles: any[] = [{ id: "existing" }];
    let feedError: string | null = null;

    const ok = await simulateFetchFeed(
      profiles,
      (p) => { profiles = p; },
      (e) => { feedError = e; }
    );

    expect(ok).toBe(true);
    expect(profiles).toEqual([]);
    expect(feedError).toBeNull();
  });

  it("handles GET /feed returning 500 without wiping out existing profiles", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal server error" }),
    });

    const initialProfiles = [{ id: "keep-me", name: "Existing" }];
    let profiles = [...initialProfiles];
    let feedError: string | null = null;

    const ok = await simulateFetchFeed(
      profiles,
      (p) => { profiles = p; },
      (e) => { feedError = e; }
    );

    expect(ok).toBe(false);
    // Crucial: existing profiles are preserved, not silently blanked!
    expect(profiles).toEqual(initialProfiles);
    expect(feedError).toContain("500");
  });

  it("handles network failure during feed loading gracefully", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

    const initialProfiles = [{ id: "keep-me", name: "Existing" }];
    let profiles = [...initialProfiles];
    let feedError: string | null = null;

    const ok = await simulateFetchFeed(
      profiles,
      (p) => { profiles = p; },
      (e) => { feedError = e; }
    );

    expect(ok).toBe(false);
    expect(profiles).toEqual(initialProfiles);
    expect(feedError).toBe("Network error while connecting to feed");
  });

  it("handles GET /matches returning 500 with separate matchesError state", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Server error" }),
    });

    let matches: any[] = [];
    let matchesError: string | null = null;

    const ok = await simulateFetchMatches(
      (m) => { matches = m; },
      (e) => { matchesError = e; }
    );

    expect(ok).toBe(false);
    expect(matchesError).toContain("500");
    // Ensure we distinguish error from a successful empty list
    expect(matches).toEqual([]);
  });

  it("clears error state when retry succeeds after a temporary failure", async () => {
    // 1. Initial attempt fails with 503
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: "Service unavailable" }),
    });

    let profiles: any[] = [];
    let feedError: string | null = null;

    const firstTry = await simulateFetchFeed(
      profiles,
      (p) => { profiles = p; },
      (e) => { feedError = e; }
    );
    expect(firstTry).toBe(false);
    expect(feedError).toContain("503");

    // 2. Retry succeeds with 200
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ profiles: [{ id: "p1", name: "Maya" }], remainingCount: 1 }),
    });

    const secondTry = await simulateFetchFeed(
      profiles,
      (p) => { profiles = p; },
      (e) => { feedError = e; }
    );
    expect(secondTry).toBe(true);
    expect(feedError).toBeNull();
    expect(profiles.length).toBe(1);
  });
});
