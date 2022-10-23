import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Login } from "@/base/schemas/login";
import type { Signup, SignupResponse } from "@/base/schemas/signup";
import { apiClient } from "@/common/providers/apiClient";
import { getCsrfToken, signIn } from "next-auth/react";

export const signUp = async (credentials: Signup) => {
  const result = await apiClient.post<SignupResponse>({
    url: "/api/register",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
    }),
  });

  return {
    user: result.data?.user,
    error: result.error,
  };
};

export const login = async (csrfToken: string, credentials: Login) => {
  const result = await signIn("credentials", {
    email: credentials.email,
    password: credentials.password,
    redirect: false,
  });

  return { error: result?.error };
};

export const logout = () => {
  supabaseClient.auth.signOut();
};
