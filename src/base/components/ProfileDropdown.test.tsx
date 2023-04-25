import ProfileDropdown from "@/base/components/ProfileDropdown";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import singletonRouter from "next/router";
import { act } from "react-test-renderer";

jest.mock("next-auth/react", () => ({
  __esModule: true,
  signOut: jest.fn(),
}));
import * as nextAuthReact from "next-auth/react";

/**
 * @group unit
 * @group components
 */
describe("ProfileDropdown", () => {
  it("renders", () => {
    const mockSession = {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { email: "user@example.com", id: "1" },
    };

    render(<ProfileDropdown session={mockSession} />);

    const userEmailText = screen.getByText("user@example.com");
    expect(userEmailText).toBeInTheDocument();
  });

  it("successfully logs out", async () => {
    const mockSession = {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { email: "user@example.com", id: "1" },
    };

    const mockNextAuthReact = nextAuthReact as { signOut: unknown };
    mockNextAuthReact.signOut = jest.fn();

    render(<ProfileDropdown session={mockSession} />);

    const logoutLink = screen.getByText("Logout");

    act(() => {
      fireEvent.click(logoutLink);
    });

    await waitFor(() => {
      expect(mockNextAuthReact.signOut).toBeCalled();
      expect(singletonRouter).toMatchObject({ asPath: "/" });
    });
  });
});
