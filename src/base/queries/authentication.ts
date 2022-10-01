import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Login } from "@/base/schemas/login";
import type { Signup, SignupResponse } from "@/base/schemas/signup";
import { apiClient } from "@/common/providers/apiClient";

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
    session: result.data?.session,
    error: result.data?.error,
  };
};

export const login = async (credentials: Login) => {
  const { error } = await supabaseClient.auth.signIn({
    email: credentials.email,
    password: credentials.password,
  });

  return { error };
};

export const logout = () => {
  supabaseClient.auth.signOut();
};
