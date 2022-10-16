import { User } from "@supabase/auth-helpers-nextjs";
import { ApiError, Session } from "@supabase/supabase-js";
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
export type Signup = z.infer<typeof signupSchema>;

export type SignupResponse = {
  user: User | null;
  // session: Session | null;
  // error: ApiError | null;
};
