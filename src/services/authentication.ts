import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const signUp = async (email: string, password: string) => {
  const { user, session, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  return { user, session, error };
};

export const login = async (email: string, password: string) => {
  const { error } = await supabaseClient.auth.signIn({
    email: email,
    password: password,
  });

  return { error };
};

export const logout = () => {
  supabaseClient.auth.signOut();
};
