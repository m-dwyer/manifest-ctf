import { Login } from "@/base/dto/Login";
import type { Signup } from "@/base/dto/Signup";
import { ResponseWithData } from "@/common/dto/ResponseWithData";
import { apiClient } from "@/common/providers/apiClient";
import { User } from "@prisma/client";
import { signIn, SignInResponse, signOut } from "next-auth/react";

export const signUp = async (
  credentials: Signup
): Promise<ResponseWithData<User>> => {
  const result = await apiClient.post<User>({
    url: "/api/register",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
    }),
  });

  return {
    success: true,
    data: result.data,
    error: result.error,
  };
};

export const login = async (
  credentials: Login
): Promise<ResponseWithData<SignInResponse>> => {
  const result = await signIn("credentials", {
    email: credentials.email,
    password: credentials.password,
    redirect: false,
  });

  return { success: true, data: result };
};

export const logout = () => {
  signOut();
};
