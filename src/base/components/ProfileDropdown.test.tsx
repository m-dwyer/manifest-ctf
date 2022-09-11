import ProfileDropdown from "@/base/components/ProfileDropdown";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import singletonRouter from "next/router";
import { act } from "react-test-renderer";

jest.mock("@/base/queries/authentication", () => ({
  __esModule: true,
  logout: null,
}));
import * as auth from "@/base/queries/authentication";

jest.mock("@supabase/auth-helpers-react", () => ({
  __esModule: true,
  useUser: null,
}));
import * as authHelper from "@supabase/auth-helpers-react";

/**
 * @group unit
 * @group components
 */
describe("ProfileDropdown", () => {
  it("renders", () => {
    const mockUseUser = authHelper as { useUser: unknown };
    mockUseUser.useUser = () => ({ user: { email: "user@example.com" } });

    render(<ProfileDropdown />);

    const userEmailText = screen.getByText("user@example.com");
    expect(userEmailText).toBeInTheDocument();
  });

  it("successfully logs out", async () => {
    const mockLogout = auth as { logout: unknown };
    mockLogout.logout = jest.fn();

    render(<ProfileDropdown />);

    const logoutLink = screen.getByText("Logout");

    act(() => {
      fireEvent.click(logoutLink);
    });

    await waitFor(() => {
      expect(mockLogout.logout).toBeCalled();
      expect(singletonRouter).toMatchObject({ asPath: "/" });
    });
  });
});
