import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET as getFeedHandler } from "../app/feed/route";
import { POST as postSwipeHandler } from "../app/swipe/route";
import { GET as getMatchesHandler } from "../app/matches/route";
import { prisma } from "../lib/prisma";
import { DEMO_USER_ID } from "../lib/constants";
import { NextRequest } from "next/server";

describe("Coy Discover Route Handlers Integration", () => {
  beforeEach(async () => {
    await prisma.match.deleteMany({});
    await prisma.swipe.deleteMany({
      where: {
        swiperId: DEMO_USER_ID,
      },
    });
  });

  it("GET /feed returns 200 with list of unswiped profiles", async () => {
    const res = await getFeedHandler();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("profiles");
    expect(data).toHaveProperty("remainingCount");
    expect(Array.isArray(data.profiles)).toBe(true);
    expect(data.profiles.length).toBeGreaterThanOrEqual(30);

    // Ensure first profile is formatted correctly
    const first = data.profiles[0];
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("age");
    expect(first).toHaveProperty("photoUrl");
    expect(first).toHaveProperty("bio");
    expect(first).toHaveProperty("cityOrCollege");
    expect(first).toHaveProperty("interests");
    expect(Array.isArray(first.interests)).toBe(true);
  });

  it("POST /swipe validates input correctly (400 on invalid payload)", async () => {
    const req = new NextRequest("http://localhost:3000/swipe", {
      method: "POST",
      body: JSON.stringify({ targetUserId: "user-maya-24", action: "invalid_action" }),
    });

    const res = await postSwipeHandler(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data).toHaveProperty("error");
  });

  it("POST /swipe handles like and detects mutual match (Maya)", async () => {
    const req = new NextRequest("http://localhost:3000/swipe", {
      method: "POST",
      body: JSON.stringify({ targetUserId: "user-maya-24", action: "like" }),
    });

    const res = await postSwipeHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.match).toBe(true);
    expect(data.matchedProfile?.name).toBe("Maya");
  });

  it("GET /matches returns mutual matches", async () => {
    // 1. Swipe like on Maya
    const swipeReq = new NextRequest("http://localhost:3000/swipe", {
      method: "POST",
      body: JSON.stringify({ targetUserId: "user-maya-24", action: "like" }),
    });
    await postSwipeHandler(swipeReq);

    // 2. Fetch matches
    const res = await getMatchesHandler();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.count).toBe(1);
    expect(data.matches[0].profile.name).toBe("Maya");
  });

  it("POST /swipe handles idempotent retries for same action", async () => {
    const req1 = new NextRequest("http://localhost:3000/swipe", {
      method: "POST",
      body: JSON.stringify({ targetUserId: "user-maya-24", action: "like" }),
    });
    const res1 = await postSwipeHandler(req1);
    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1.match).toBe(true);

    // Repeated request with same action
    const req2 = new NextRequest("http://localhost:3000/swipe", {
      method: "POST",
      body: JSON.stringify({ targetUserId: "user-maya-24", action: "like" }),
    });
    const res2 = await postSwipeHandler(req2);
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.match).toBe(true);
  });

  it("POST /swipe returns 409 Conflict when attempting to change a swipe decision", async () => {
    // 1. First swipe: like
    const req1 = new NextRequest("http://localhost:3000/swipe", {
      method: "POST",
      body: JSON.stringify({ targetUserId: "user-maya-24", action: "like" }),
    });
    const res1 = await postSwipeHandler(req1);
    expect(res1.status).toBe(200);

    // 2. Conflicting swipe: pass
    const req2 = new NextRequest("http://localhost:3000/swipe", {
      method: "POST",
      body: JSON.stringify({ targetUserId: "user-maya-24", action: "pass" }),
    });
    const res2 = await postSwipeHandler(req2);
    expect(res2.status).toBe(409);
    const data2 = await res2.json();
    expect(data2.error).toMatch(/Conflict/);
  });

  it("POST /swipe handles concurrent identical requests and concurrent conflicting requests", async () => {
    // 1. Concurrent identical requests
    const [resA, resB] = await Promise.all([
      postSwipeHandler(
        new NextRequest("http://localhost:3000/swipe", {
          method: "POST",
          body: JSON.stringify({ targetUserId: "user-maya-24", action: "like" }),
        })
      ),
      postSwipeHandler(
        new NextRequest("http://localhost:3000/swipe", {
          method: "POST",
          body: JSON.stringify({ targetUserId: "user-maya-24", action: "like" }),
        })
      ),
    ]);
    expect(resA.status).toBe(200);
    expect(resB.status).toBe(200);

    // 2. Concurrent conflicting requests on Julian
    const responses = await Promise.all([
      postSwipeHandler(
        new NextRequest("http://localhost:3000/swipe", {
          method: "POST",
          body: JSON.stringify({ targetUserId: "user-julian-26", action: "like" }),
        })
      ),
      postSwipeHandler(
        new NextRequest("http://localhost:3000/swipe", {
          method: "POST",
          body: JSON.stringify({ targetUserId: "user-julian-26", action: "pass" }),
        })
      ),
    ]);

    const statuses = responses.map((r) => r.status).sort();
    expect(statuses).toEqual([200, 409]);
  });

  it("GET /feed returns HTTP 500 on unexpected service failure", async () => {
    const originalFindMany = prisma.profile.findMany;
    (prisma.profile as any).findMany = vi.fn().mockRejectedValueOnce(new Error("Database connection lost"));

    const res = await getFeedHandler();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Failed to retrieve feed profiles");

    prisma.profile.findMany = originalFindMany;
  });

  it("GET /matches returns HTTP 500 on unexpected service failure", async () => {
    const originalFindMany = prisma.match.findMany;
    (prisma.match as any).findMany = vi.fn().mockRejectedValueOnce(new Error("Database connection lost"));

    const res = await getMatchesHandler();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Failed to retrieve matches");

    prisma.match.findMany = originalFindMany;
  });
});
