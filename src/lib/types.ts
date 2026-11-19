export interface ProfileDTO {
  id: string;
  userId: string;
  name: string;
  age: number;
  photoUrl: string;
  bio: string;
  cityOrCollege: string;
  interests: string[];
}

export interface SwipeRequest {
  targetUserId: string;
  action: "like" | "pass";
}

export interface SwipeResponse {
  success: boolean;
  match: boolean;
  matchedProfile?: ProfileDTO;
  message?: string;
}

export interface MatchItemDTO {
  id: string;
  matchedAt: string;
  profile: ProfileDTO;
}

export interface FeedResponse {
  profiles: ProfileDTO[];
  remainingCount: number;
}
