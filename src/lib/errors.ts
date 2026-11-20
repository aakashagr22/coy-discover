/**
 * Domain error classes for Coy Discover business logic.
 */

export class SwipeConflictError extends Error {
  constructor(message: string = "Conflict: Profile has already been swiped on with a different decision") {
    super(message);
    this.name = "SwipeConflictError";
  }
}

export class ProfileNotFoundError extends Error {
  constructor(message: string = "Target user profile not found") {
    super(message);
    this.name = "ProfileNotFoundError";
  }
}

export class SelfSwipeError extends Error {
  constructor(message: string = "Cannot swipe on yourself") {
    super(message);
    this.name = "SelfSwipeError";
  }
}
