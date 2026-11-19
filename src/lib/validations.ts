import { z } from "zod";

export const swipeSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID is required"),
  action: z.enum(["like", "pass"], {
    errorMap: () => ({ message: "Action must be either 'like' or 'pass'" }),
  }),
});

export type SwipeInput = z.infer<typeof swipeSchema>;
