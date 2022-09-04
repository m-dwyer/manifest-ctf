jest.mock("@supabase/auth-helpers-react", () => ({
  useUser: () => ({ user: { email: "foo@bar.com" } }),
}));

jest.mock("@supabase/auth-helpers-nextjs", () => ({
  supabaseClient: () => ({
    auth: {
      signUp: () => {},
      signIn: () => {},
      signOut: () => {},
    },
  }),
}));

import Header from "@/base/components/Header";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Header", () => {
  it("renders", () => {
    render(<Header />);
    expect(screen.getByText("ManifestCTF")).toBeInTheDocument();
  });
});
