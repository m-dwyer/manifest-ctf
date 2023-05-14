import { z } from "zod";

export const profileOverviewSchema = z.object({
  id: z.number(),
  attemptsByPeriod: z.record(z.number().positive()),
});

export type ProfileOverview = z.infer<typeof profileOverviewSchema>;
