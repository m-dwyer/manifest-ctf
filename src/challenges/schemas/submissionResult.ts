import { z } from "zod";

export const submissionResultSchema = z.object({
  flag: z.string().min(1),
  correct: z.boolean(),
});

export type SubmissionResult = z.infer<typeof submissionResultSchema>;
