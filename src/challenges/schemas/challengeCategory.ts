import { z } from "zod";

export const challengeCategorySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
});
export type ChallengeCategory = z.infer<typeof challengeCategorySchema>;
