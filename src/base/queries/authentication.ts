import { Login } from "@/base/schemas/login";
import type { Signup } from "@/base/schemas/signup";
import { apiClient } from "@/common/providers/apiClient";
import { User } from "@prisma/client";
import { signIn, signOut } from "next-auth/react";

export const signUp = async (credentials: Signup) => {
  const result = await apiClient.post<User>({
    url: "/api/register",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
    }),
  });

  return {
    user: result.data,
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
  signOut();
};
