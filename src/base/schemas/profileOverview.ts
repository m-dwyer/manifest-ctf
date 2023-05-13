import { z } from "zod";

export const profileOverviewSchema = z.object({
  id: z.number(),
  attemptsByPeriod: z.record(
    z.array(
      z.object({
        completed: z.date().or(z.null()),
        points_scored: z.number().positive(),
      })
    )
  ),
});

export type ProfileOverview = z.infer<typeof profileOverviewSchema>;
