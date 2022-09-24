import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Login } from "@/base/schemas/login";
import type { Signup } from "@/base/schemas/signup";

export const signUp = async (credentials: Signup) => {
  const { user, session, error } = await supabaseClient.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  return { user, session, error };
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
