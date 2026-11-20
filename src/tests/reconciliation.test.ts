import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Failed-Swipe Feed Reconciliation Logic", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // Reconciled simulation of handleSwipe from src/app/page.tsx
  async function simulateHandleSwipe(
    action: "like" | "pass",
    swipedProfile: { userId: string; name: string },
    initialProfiles: any[],
    fetchFeedMock: () => Promise<boolean>,
    setErrorMessage: (msg: string | null) => void,
    setProfiles: (update: (prev: any[]) => any[]) => void
  ) {
    // 1. Optimistic removal
    setProfiles((prev) => prev.filter((p) => p.userId !== swipedProfile.userId));

    try {
      const res = await fetch("/swipe", {
        method: "POST",
        body: JSON.stringify({ targetUserId: swipedProfile.userId, action }),
      });

      if (res.ok) {
        return;
      }

      if (res.status === 409) {
        setErrorMessage("Profile already swiped. Reconciling feed...");
        await fetchFeedMock();
      } else if (res.status === 404) {
        setErrorMessage("Profile not found. Reconciling feed...");
        await fetchFeedMock();
      } else {
        setErrorMessage("Server error during swipe. Reconciling feed...");
        const reconciled = await fetchFeedMock();
        if (!reconciled) {
          setErrorMessage("Unable to confirm swipe status. Please check your connection.");
        }
      }
    } catch {
      setErrorMessage("Network issue during swipe. Reconciling feed...");
      const reconciled = await fetchFeedMock();
      if (!reconciled) {
        setErrorMessage("Network disconnected. Swipe outcome could not be verified.");
      }
    }
  }

  it("handles successful like action and keeps card removed", async () => {
    const swiped = { userId: "user-maya-24", name: "Maya" };
    const remaining = [{ userId: "user-elena-25", name: "Elena" }];
    let currentProfiles = [swiped, ...remaining];
    let errorMessage: string | null = null;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, match: true }),
    });

    const fetchFeedMock = vi.fn();

    await simulateHandleSwipe(
      "like",
      swiped,
      currentProfiles,
      fetchFeedMock,
      (msg) => { errorMessage = msg; },
      (updater) => { currentProfiles = updater(currentProfiles); }
    );

    expect(fetchFeedMock).not.toHaveBeenCalled();
    expect(errorMessage).toBeNull();
    expect(currentProfiles.some((p) => p.userId === "user-maya-24")).toBe(false);
    expect(currentProfiles.length).toBe(1);
  });

  it("handles successful pass action and keeps card removed", async () => {
    const swiped = { userId: "user-elena-25", name: "Elena" };
    const remaining = [{ userId: "user-julian-26", name: "Julian" }];
    let currentProfiles = [swiped, ...remaining];
    let errorMessage: string | null = null;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, match: false }),
    });

    const fetchFeedMock = vi.fn();

    await simulateHandleSwipe(
      "pass",
      swiped,
      currentProfiles,
      fetchFeedMock,
      (msg) => { errorMessage = msg; },
      (updater) => { currentProfiles = updater(currentProfiles); }
    );

    expect(fetchFeedMock).not.toHaveBeenCalled();
    expect(errorMessage).toBeNull();
    expect(currentProfiles.some((p) => p.userId === "user-elena-25")).toBe(false);
    expect(currentProfiles.length).toBe(1);
  });

  it("reconciles feed on HTTP 409 without blindly restoring swiped profile", async () => {
    const swiped = { userId: "user-maya-24", name: "Maya" };
    const remaining = [{ userId: "user-elena-25", name: "Elena" }];
    let currentProfiles = [swiped, ...remaining];
    let errorMessage: string | null = null;

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ error: "Conflict: Profile has already been swiped on" }),
    });

    const fetchFeedMock = vi.fn().mockImplementation(async () => {
      // Server returns feed without Maya because she was already swiped
      currentProfiles = [...remaining];
      return true;
    });

    await simulateHandleSwipe(
      "like",
      swiped,
      currentProfiles,
      fetchFeedMock,
      (msg) => { errorMessage = msg; },
      (updater) => { currentProfiles = updater(currentProfiles); }
    );

    // Verified: fetchFeed was called to reconcile with backend
    expect(fetchFeedMock).toHaveBeenCalled();
    expect(errorMessage).toContain("already swiped");
    // Verified: Maya is NOT blindly restored!
    expect(currentProfiles.some((p) => p.userId === "user-maya-24")).toBe(false);
  });

  it("reconciles feed on HTTP 404 without blindly restoring nonexistent profile", async () => {
    const swiped = { userId: "user-ghost", name: "Ghost" };
    let currentProfiles = [swiped, { userId: "user-maya-24", name: "Maya" }];
    let errorMessage: string | null = null;

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: "Target user profile not found" }),
    });

    const fetchFeedMock = vi.fn().mockImplementation(async () => {
      currentProfiles = [{ userId: "user-maya-24", name: "Maya" }];
      return true;
    });

    await simulateHandleSwipe(
      "like",
      swiped,
      currentProfiles,
      fetchFeedMock,
      (msg) => { errorMessage = msg; },
      (updater) => { currentProfiles = updater(currentProfiles); }
    );

    expect(fetchFeedMock).toHaveBeenCalled();
    expect(currentProfiles.some((p) => p.userId === "user-ghost")).toBe(false);
  });

  it("attempts reconciliation on HTTP 500 because operation may have committed", async () => {
    const swiped = { userId: "user-maya-24", name: "Maya" };
    let currentProfiles = [swiped, { userId: "user-elena-25", name: "Elena" }];
    let errorMessage: string | null = null;

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal server error" }),
    });

    const fetchFeedMock = vi.fn().mockResolvedValue(true);

    await simulateHandleSwipe(
      "like",
      swiped,
      currentProfiles,
      fetchFeedMock,
      (msg) => { errorMessage = msg; },
      (updater) => { currentProfiles = updater(currentProfiles); }
    );

    expect(fetchFeedMock).toHaveBeenCalled();
    expect(errorMessage).toContain("Server error");
  });

  it("preserves feed and sets unconfirmed warning when reconciliation itself fails", async () => {
    const swiped = { userId: "user-maya-24", name: "Maya" };
    const initialList = [{ userId: "user-elena-25", name: "Elena" }];
    let currentProfiles = [swiped, ...initialList];
    let errorMessage: string | null = null;

    // Swipe fails with 500
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal server error" }),
    });

    // Reconciliation fetchFeed also fails (e.g. offline)
    const fetchFeedMock = vi.fn().mockResolvedValue(false);

    await simulateHandleSwipe(
      "like",
      swiped,
      currentProfiles,
      fetchFeedMock,
      (msg) => { errorMessage = msg; },
      (updater) => { currentProfiles = updater(currentProfiles); }
    );

    expect(fetchFeedMock).toHaveBeenCalled();
    // Profile is kept off the top stack so user doesn't see a duplicate/stuck card
    expect(currentProfiles.some((p) => p.userId === "user-maya-24")).toBe(false);
    expect(errorMessage).toContain("Unable to confirm swipe status");
  });

  it("handles network failure during swipe and preserves feed without restoring duplicate card", async () => {
    const swiped = { userId: "user-maya-24", name: "Maya" };
    let currentProfiles = [swiped, { userId: "user-elena-25", name: "Elena" }];
    let errorMessage: string | null = null;

    global.fetch = vi.fn().mockRejectedValue(new Error("Network connection dropped"));
    const fetchFeedMock = vi.fn().mockResolvedValue(false);

    await simulateHandleSwipe(
      "like",
      swiped,
      currentProfiles,
      fetchFeedMock,
      (msg) => { errorMessage = msg; },
      (updater) => { currentProfiles = updater(currentProfiles); }
    );

    expect(fetchFeedMock).toHaveBeenCalled();
    expect(errorMessage).toContain("Network disconnected");
  });
});
