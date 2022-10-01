import * as auth from "@/base/queries/authentication";

jest.mock("@supabase/auth-helpers-nextjs", () => ({
  __esModule: true,
  signUp: null,
}));
import * as authHelper from "@supabase/auth-helpers-nextjs";

jest.mock("@/common/providers/apiClient", () => ({
  __esModule: true,
  post: null,
}));
import * as apiClientHelper from "@/common/providers/apiClient";
import { ResponseWithData } from "@/common/types/ResponseWithData";
import { SignupResponse } from "../schemas/signup";

describe("authentication", () => {
  it("successfully signs up", async () => {
    const mockApiClientHelper = apiClientHelper as { apiClient: unknown };

    const mockSignUp = jest.fn(
      () =>
        ({
          data: {
            user: { email: "foo@bar.com" },
            session: { refresh_token: "abcd" },
            error: null,
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
      user: { email: "foo@bar.com" },
      session: { refresh_token: "abcd" },
      error: null,
    });
  });

  it("successfully logs in", async () => {
    const mockAuthHelper = authHelper as { supabaseClient: unknown };
    const mockSignIn = jest.fn(() => ({
      error: null,
    }));

    mockAuthHelper.supabaseClient = {
      auth: {
        signIn: mockSignIn,
      },
    };

    const result = await auth.login({
      email: "foo@bar.com",
      password: "MyPassword1!",
    });
    expect(result).toMatchObject({ error: null });
    expect(mockSignIn).toBeCalled();
  });

  it("successfully logs out", async () => {
    const mockAuthHelper = authHelper as { supabaseClient: unknown };
    const mockSignOut = jest.fn();
    mockAuthHelper.supabaseClient = {
      auth: {
        signOut: mockSignOut,
      },
    };

    const result = await auth.logout();
    expect(result).toBeUndefined();
    expect(mockSignOut).toBeCalled();
  });
});
