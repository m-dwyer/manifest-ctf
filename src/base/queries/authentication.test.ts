import * as auth from "@/base/queries/authentication";

jest.mock("@supabase/auth-helpers-nextjs", () => ({
  __esModule: true,
  signUp: null,
}));
import * as authHelper from "@supabase/auth-helpers-nextjs";

describe("authentication", () => {
  it("successfully signs up", async () => {
    const mockAuthHelper = authHelper as { supabaseClient: unknown };
    mockAuthHelper.supabaseClient = {
      auth: {
        signUp: jest.fn(() => ({
          user: { email: "foo@bar.com" },
          session: {},
          error: null,
        })),
      },
    };

    const result = await auth.signUp("foo@bar.com", "MyPassword1!");

    expect(result).toMatchObject({
      user: { email: "foo@bar.com" },
      session: {},
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

    const result = await auth.login("foo@bar.com", "MyPassword1!");
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
