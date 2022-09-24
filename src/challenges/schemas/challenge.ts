import { z } from "zod";

export const baseChallengeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  flag: z.string().min(4),
  points: z.string().transform((val, ctx) => {
    const parsed = parseInt(val);
    if (isNaN(parsed) || parsed < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Not a number",
      });
      return z.NEVER;
    }
    return parsed;
  }),
});

export const challengeToUpsertSchema = baseChallengeSchema.and(
  z.object({
    category: z.string().min(1),
  })
);

export type ChallengeToUpsert = z.infer<typeof challengeToUpsertSchema>;

export const challengeWithCompletionSchema = challengeToUpsertSchema.and(
  z.object({
    challenge_attempts: z.tuple([
      z.object({
        completed: z.boolean(),
      }),
    ]),
  })
);

export const challengeCategorySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
});
export type ChallengeCategory = z.infer<typeof challengeCategorySchema>;

export type ChallengeWithCompletion = z.infer<
  typeof challengeWithCompletionSchema
>;

export const challengeWithCategoriesSchema = baseChallengeSchema.and(
  z.object({
    category: challengeCategorySchema,
  })
);

export type ChallengeWithCategories = z.infer<
  typeof challengeWithCategoriesSchema
>;
