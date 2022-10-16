import { z } from "zod";

export const submissionSchema = z.object({
  challenge: z.number(),
  flag: z.string().min(1),
});

export type Submission = z.infer<typeof submissionSchema>;
