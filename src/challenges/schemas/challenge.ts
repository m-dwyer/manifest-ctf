import { z } from "zod";

import { challengeCategorySchema } from "@/challenges/schemas/challengeCategory";

export const baseChallengeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  flag: z.string().min(4),
  points: z.number().positive(),
});

export type BaseChallenge = z.infer<typeof baseChallengeSchema>;

export const challengeToUpsertSchema = baseChallengeSchema.and(
  z.object({
    categoryId: z.string().min(1),
  })
);
export type ChallengeToUpsert = z.infer<typeof challengeToUpsertSchema>;

export const challengeWithCompletionSchema = baseChallengeSchema.and(
  z.object({
    challenge_attempts: z.tuple([
      z.object({
        completed: z.boolean(),
        attempts: z.number(),
      }),
    ]),
  })
);
export type ChallengeWithCompletion = z.infer<
  typeof challengeWithCompletionSchema
>;

export const challengeCompletionSchema = z.object({
  user_id: z.string(),
  challenge_id: z.number(),
  completed: z.boolean(),
  attempts: z.number().positive(),
  points_scored: z.number(),
});
export type ChallengeCompletion = z.infer<typeof challengeCompletionSchema>;

export const challengeWithCategoriesSchema = baseChallengeSchema.and(
  z.object({
    category: challengeCategorySchema,
  })
);
export type ChallengeWithCategories = z.infer<
  typeof challengeWithCategoriesSchema
>;

export const deleteChallengeSchema = z.object({
  challenge: z.number(),
});
export type DeleteChallenge = z.infer<typeof deleteChallengeSchema>;
