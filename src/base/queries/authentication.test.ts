import * as nextAuthReact from "next-auth/react";
const mockNextAuthHelper = nextAuthReact as {
  signIn: unknown;
  signOut: unknown;
};

mockNextAuthHelper.signIn = jest.fn();
mockNextAuthHelper.signOut = jest.fn();

import * as auth from "@/base/queries/authentication";

jest.mock("@/common/providers/apiClient", () => ({
  __esModule: true,
  post: null,
}));

import * as apiClientHelper from "@/common/providers/apiClient";
import { ResponseWithData } from "@/common/dto/ResponseWithData";
import { SignupResponse } from "@/base/dto/Signup";
import { expect, jest } from "@jest/globals";

describe("authentication", () => {
  it("successfully signs up", async () => {
    const mockApiClientHelper = apiClientHelper as { apiClient: unknown };

    const mockSignUp = jest.fn(
      () =>
        ({
          success: true,
          data: {
            user: { email: "foo@bar.com" },
          },
        } as ResponseWithData<SignupResponse>)
    );

    mockApiClientHelper.apiClient = {
      post: mockSignUp,
    };

    const result = await auth.signUp({
      email: "foo@bar.com",
      password: "MyPassword1!",
      confirmPassword: "MyPassword1!",
    });

    expect(result).toMatchObject({
      success: true,
      data: { user: { email: "foo@bar.com" } },
      error: undefined,
    });
  });

  it("successfully logs in", async () => {
    mockNextAuthHelper.signIn = jest.fn(() => ({
      status: 200,
      ok: true,
    }));

    const result = await auth.login({
      email: "foo@bar.com",
      password: "MyPassword1!",
    });
    expect(result).toMatchObject({
      success: true,
      data: { status: 200, ok: true },
    });
    expect(mockNextAuthHelper.signIn).toBeCalled();
  });

  it("successfully logs out", async () => {
    const result = await auth.logout();
    expect(result).toBeUndefined();
    expect(mockNextAuthHelper.signOut).toBeCalled();
  });

  it("returns an error on unsuccessful login", async () => {
    mockNextAuthHelper.signIn = jest.fn(() => ({
      status: 401,
      ok: false,
      error: "CredentialsSignin",
    }));

    const result = await auth.login({
      email: "foo@bar.com",
      password: "MyPassword1!",
    });
    expect(result).toMatchObject({
      success: false,
      error: "Invalid credentials",
      data: { status: 401, ok: false },
    });
    expect(mockNextAuthHelper.signIn).toBeCalled();
  });
});
