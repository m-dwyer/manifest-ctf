import { z } from "zod";

export const profileOverviewSchema = z.object({
  id: z.number(),
  challengeAttempts: z.array(
    z.object({
      completed: z.date(),
      points_scored: z.number().positive(),
    })
  ),
});

export type ProfileOverview = z.infer<typeof profileOverviewSchema>;
