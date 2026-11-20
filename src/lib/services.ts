import { prisma } from "./prisma";
import { DEMO_USER_ID } from "./constants";
import { ProfileDTO, MatchItemDTO, SwipeResponse } from "./types";
import { SwipeInput } from "./validations";

export { DEMO_USER_ID };

/**
 * Helper to safely format a Prisma profile record into a client-safe ProfileDTO.
 * Strictly strips any incoming swipe or match metadata to preserve Coy's privacy promise.
 */
export function formatProfile(profile: {
  id: string;
  userId: string;
  name: string;
  age: number;
  photoUrl: string;
  bio: string;
  cityOrCollege: string;
  interests: string;
}): ProfileDTO {
  let parsedInterests: string[] = [];
  try {
    parsedInterests = JSON.parse(profile.interests);
  } catch {
    parsedInterests = profile.interests.split(",").map((s) => s.trim());
  }

  return {
    id: profile.id,
    userId: profile.userId,
    name: profile.name,
    age: profile.age,
    photoUrl: profile.photoUrl,
    bio: profile.bio,
    cityOrCollege: profile.cityOrCollege,
    interests: parsedInterests,
  };
}

/**
 * Returns all profiles that the current user has not yet swiped on.
 * Excludes the current user's own profile and profiles with an existing swipe from the user.
 */
export async function getFeedProfiles(userId: string = DEMO_USER_ID): Promise<ProfileDTO[]> {
  // 1. Get all target IDs already swiped by this user
  const swipedTargetIds = await prisma.swipe.findMany({
    where: { swiperId: userId },
    select: { targetId: true },
  });
  const excludedUserIds = [userId, ...swipedTargetIds.map((s) => s.targetId)];

  // 2. Fetch unswiped profiles
  const profiles = await prisma.profile.findMany({
    where: {
      userId: {
        notIn: excludedUserIds,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return profiles.map(formatProfile);
}

/**
 * Records a swipe (like or pass) and determines if a mutual match occurred.
 * Uses a database transaction for consistency and atomicity.
 */
export async function recordSwipe(
  input: SwipeInput,
  swiperId: string = DEMO_USER_ID
): Promise<SwipeResponse> {
  const { targetUserId, action } = input;

  if (targetUserId === swiperId) {
    throw new Error("Cannot swipe on yourself");
  }

  // Verify target user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { profile: true },
  });

  if (!targetUser || !targetUser.profile) {
    throw new Error("Target user profile not found");
  }

  const targetProfile = targetUser.profile;

  // Execute in transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Check for existing swipe by this user on target to enforce immutability
    const existingSwipe = await tx.swipe.findUnique({
      where: {
        swiperId_targetId: {
          swiperId,
          targetId: targetUserId,
        },
      },
    });

    if (existingSwipe) {
      // Conflicting decision: reject mutation
      if (existingSwipe.action !== action) {
        throw new Error("Conflict: Profile has already been swiped on with a different decision");
      }

      // Idempotent retry: return previously computed outcome
      if (action === "pass") {
        return {
          success: true,
          match: false,
        };
      }

      // If existing action was 'like', check if mutual match exists
      const [userAId, userBId] = [swiperId, targetUserId].sort();
      const existingMatch = await tx.match.findUnique({
        where: {
          userAId_userBId: {
            userAId,
            userBId,
          },
        },
      });

      return {
        success: true,
        match: Boolean(existingMatch),
        matchedProfile: existingMatch ? formatProfile(targetProfile) : undefined,
      };
    }

    // 2. Create new immutable swipe record
    await tx.swipe.create({
      data: {
        swiperId,
        targetId: targetUserId,
        action,
      },
    });

    // If passed, definitely no match
    if (action === "pass") {
      return {
        success: true,
        match: false,
      };
    }

    // 3. If liked, check if target has also liked swiper
    const reciprocalSwipe = await tx.swipe.findUnique({
      where: {
        swiperId_targetId: {
          swiperId: targetUserId,
          targetId: swiperId,
        },
      },
    });

    const isMutualLike = reciprocalSwipe?.action === "like";

    if (isMutualLike) {
      // Sort IDs canonically to prevent duplicate inverse records
      const [userAId, userBId] = [swiperId, targetUserId].sort();

      await tx.match.upsert({
        where: {
          userAId_userBId: {
            userAId,
            userBId,
          },
        },
        update: {},
        create: {
          userAId,
          userBId,
        },
      });

      return {
        success: true,
        match: true,
        matchedProfile: formatProfile(targetProfile),
      };
    }

    return {
      success: true,
      match: false,
    };
  });
}

/**
 * Returns all mutual matches for the user.
 */
export async function getMutualMatches(userId: string = DEMO_USER_ID): Promise<MatchItemDTO[]> {
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return matches.map((m) => {
    const otherUser = m.userAId === userId ? m.userB : m.userA;
    if (!otherUser?.profile) {
      throw new Error("Matched profile missing");
    }

    return {
      id: m.id,
      matchedAt: m.createdAt.toISOString(),
      profile: formatProfile(otherUser.profile),
    };
  });
}
