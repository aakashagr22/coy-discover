import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/prisma";
import { getFeedProfiles, recordSwipe, getMutualMatches, DEMO_USER_ID } from "../lib/services";

describe("Coy Discover Core Matching & Privacy Rules", () => {
  beforeEach(async () => {
    // Reset matches and swipes involving demo user
    await prisma.match.deleteMany({});
    await prisma.swipe.deleteMany({
      where: {
        swiperId: DEMO_USER_ID,
      },
    });
  });

  it("ensures seeded incoming likes do NOT automatically become mutual matches", async () => {
    // Even though 17 profiles have liked the demo user, no mutual match exists until demo user likes them
    const matches = await getMutualMatches();
    expect(matches.length).toBe(0);

    // Verify incoming like exists in DB for Maya
    const incomingSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_targetId: {
          swiperId: "user-maya-24",
          targetId: DEMO_USER_ID,
        },
      },
    });
    expect(incomingSwipe).not.toBeNull();
    expect(incomingSwipe?.action).toBe("like");

    // But no match exists yet
    const matchRecord = await prisma.match.findFirst({
      where: {
        OR: [{ userAId: "user-maya-24" }, { userBId: "user-maya-24" }],
      },
    });
    expect(matchRecord).toBeNull();
  });

  it("never exposes incoming likes in feed profiles (Privacy Rule)", async () => {
    const feed = await getFeedProfiles();
    expect(feed.length).toBeGreaterThan(0);

    for (const profile of feed) {
      // Must not leak any incoming swipe data
      expect(profile).not.toHaveProperty("hasLikedDemoUser");
      expect(profile).not.toHaveProperty("hasLikedUser");
      expect(profile).not.toHaveProperty("incomingLike");
      expect(profile).not.toHaveProperty("swipesGiven");
      expect(profile).not.toHaveProperty("swipesReceived");
      expect(Array.isArray(profile.interests)).toBe(true);
    }
  });

  it("excludes already swiped profiles from the feed", async () => {
    const initialFeed = await getFeedProfiles();
    const firstProfile = initialFeed[0];

    // Swipe on the first profile
    await recordSwipe({
      targetUserId: firstProfile.userId,
      action: "pass",
    });

    const updatedFeed = await getFeedProfiles();
    expect(updatedFeed.some((p) => p.userId === firstProfile.userId)).toBe(false);
    expect(updatedFeed.length).toBe(initialFeed.length - 1);
  });

  it("does not create a match when action is pass", async () => {
    // Maya has liked the demo user in seed
    const result = await recordSwipe({
      targetUserId: "user-maya-24",
      action: "pass",
    });

    expect(result.success).toBe(true);
    expect(result.match).toBe(false);
    expect(result.matchedProfile).toBeUndefined();

    const matches = await getMutualMatches();
    expect(matches.some((m) => m.profile.userId === "user-maya-24")).toBe(false);
  });

  it("does not create a match when target has not liked the demo user", async () => {
    // Elena has NOT liked the demo user in seed
    const result = await recordSwipe({
      targetUserId: "user-elena-25",
      action: "like",
    });

    expect(result.success).toBe(true);
    expect(result.match).toBe(false);
    expect(result.matchedProfile).toBeUndefined();

    const matches = await getMutualMatches();
    expect(matches.some((m) => m.profile.userId === "user-elena-25")).toBe(false);
  });

  it("creates a mutual match only after the logged-in user independently likes the same profile", async () => {
    // Maya has liked demo user in seed
    const result = await recordSwipe({
      targetUserId: "user-maya-24",
      action: "like",
    });

    expect(result.success).toBe(true);
    expect(result.match).toBe(true);
    expect(result.matchedProfile).toBeDefined();
    expect(result.matchedProfile?.name).toBe("Maya");

    const matches = await getMutualMatches();
    const mayaMatch = matches.find((m) => m.profile.userId === "user-maya-24");
    expect(mayaMatch).toBeDefined();
    expect(mayaMatch?.profile.name).toBe("Maya");
  });

  it("persists matches across subsequent queries", async () => {
    // Julian has also liked demo user in seed
    await recordSwipe({
      targetUserId: "user-julian-26",
      action: "like",
    });

    const matches = await getMutualMatches();
    expect(matches.some((m) => m.profile.userId === "user-julian-26")).toBe(true);
  });

  describe("Swipe Immutability & Conflict Handling", () => {
    it("handles repeated swipes with identical action idempotently without duplicate records", async () => {
      // 1. Initial swipe: Like Maya (who already liked demo user)
      const firstResult = await recordSwipe({
        targetUserId: "user-maya-24",
        action: "like",
      });
      expect(firstResult.success).toBe(true);
      expect(firstResult.match).toBe(true);

      // 2. Retry: Same swipe action
      const retryResult = await recordSwipe({
        targetUserId: "user-maya-24",
        action: "like",
      });
      expect(retryResult.success).toBe(true);
      expect(retryResult.match).toBe(true);
      expect(retryResult.matchedProfile?.userId).toBe("user-maya-24");

      // Verify only 1 swipe record exists in DB for this pair
      const swipeRecords = await prisma.swipe.findMany({
        where: {
          swiperId: DEMO_USER_ID,
          targetId: "user-maya-24",
        },
      });
      expect(swipeRecords.length).toBe(1);

      // Verify only 1 match record exists in DB
      const matchRecords = await prisma.match.findMany({
        where: {
          OR: [
            { userAId: DEMO_USER_ID, userBId: "user-maya-24" },
            { userAId: "user-maya-24", userBId: DEMO_USER_ID },
          ],
        },
      });
      expect(matchRecords.length).toBe(1);
    });

    it("handles repeated pass action idempotently", async () => {
      // 1. Initial pass
      const first = await recordSwipe({
        targetUserId: "user-elena-25",
        action: "pass",
      });
      expect(first.success).toBe(true);
      expect(first.match).toBe(false);

      // 2. Retry pass
      const retry = await recordSwipe({
        targetUserId: "user-elena-25",
        action: "pass",
      });
      expect(retry.success).toBe(true);
      expect(retry.match).toBe(false);

      const swipeRecords = await prisma.swipe.findMany({
        where: {
          swiperId: DEMO_USER_ID,
          targetId: "user-elena-25",
        },
      });
      expect(swipeRecords.length).toBe(1);
    });

    it("rejects conflicting swipe action on already swiped profile", async () => {
      // 1. Like Maya first
      await recordSwipe({
        targetUserId: "user-maya-24",
        action: "like",
      });

      // 2. Attempt to pass on Maya should throw conflict error
      await expect(
        recordSwipe({
          targetUserId: "user-maya-24",
          action: "pass",
        })
      ).rejects.toThrow(/Conflict: Profile has already been swiped on with a different decision/);

      // Verify action in DB remains 'like'
      const swipe = await prisma.swipe.findUnique({
        where: {
          swiperId_targetId: {
            swiperId: DEMO_USER_ID,
            targetId: "user-maya-24",
          },
        },
      });
      expect(swipe?.action).toBe("like");
    });

    it("safely handles simultaneous identical swipe requests concurrently", async () => {
      // Fire 3 simultaneous like requests for Maya
      const results = await Promise.all([
        recordSwipe({ targetUserId: "user-maya-24", action: "like" }),
        recordSwipe({ targetUserId: "user-maya-24", action: "like" }),
        recordSwipe({ targetUserId: "user-maya-24", action: "like" }),
      ]);

      // All should succeed idempotently
      for (const res of results) {
        expect(res.success).toBe(true);
        expect(res.match).toBe(true);
      }

      // Exactly 1 swipe record and 1 match record in DB
      const swipeRecords = await prisma.swipe.findMany({
        where: { swiperId: DEMO_USER_ID, targetId: "user-maya-24" },
      });
      expect(swipeRecords.length).toBe(1);

      const matchRecords = await prisma.match.findMany({
        where: {
          OR: [
            { userAId: DEMO_USER_ID, userBId: "user-maya-24" },
            { userAId: "user-maya-24", userBId: DEMO_USER_ID },
          ],
        },
      });
      expect(matchRecords.length).toBe(1);
    });

    it("ensures unique constraints protect swipe decisions during concurrent conflicting requests", async () => {
      // Fire simultaneous conflicting requests (like vs pass) on Julian
      const outcomes = await Promise.allSettled([
        recordSwipe({ targetUserId: "user-julian-26", action: "like" }),
        recordSwipe({ targetUserId: "user-julian-26", action: "pass" }),
      ]);

      // Exactly one should succeed, and one should be rejected with a conflict error
      const fulfilled = outcomes.filter((o) => o.status === "fulfilled");
      const rejected = outcomes.filter((o) => o.status === "rejected");

      expect(fulfilled.length).toBe(1);
      expect(rejected.length).toBe(1);

      const rejectionReason = (rejected[0] as PromiseRejectedResult).reason;
      expect(rejectionReason.message).toMatch(/Conflict/);

      // Unique constraint ensured only 1 swipe record exists
      const swipeRecords = await prisma.swipe.findMany({
        where: { swiperId: DEMO_USER_ID, targetId: "user-julian-26" },
      });
      expect(swipeRecords.length).toBe(1);
    });
  });
});
