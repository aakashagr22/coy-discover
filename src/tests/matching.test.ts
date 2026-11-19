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
});
