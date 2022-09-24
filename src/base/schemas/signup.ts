import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword == data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
