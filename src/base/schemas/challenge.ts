import { z } from "zod";

export const challengeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  flag: z.string().min(4),
  points: z.string().transform((v) => Number(v)),
});
