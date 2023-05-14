import NavBar from "@/base/components/NavBar";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import singletonRouter from "next/router";
import { act } from "react-test-renderer";

import { useSession } from "next-auth/react";
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: "foo@bar.com", role: "USER" },
};
jest.mock("next-auth/react", () => ({
  __esModule: true,
  useSession: jest.fn(() => {
    return { data: mockSession, status: "authenticated" };
  }),
}));

import * as useSessionHelper from "next-auth/react";

/**
 * @group unit
 * @group components
 */
describe("NavBar", () => {
  it("renders", () => {
    const mockUserSession = useSessionHelper as { useSession: unknown };
    mockUserSession.useSession = jest.fn(() => ({
      data: { user: { email: "foo@bar.com", role: "USER" } },
    }));

    render(<NavBar />);

    const challengesLink = screen.getByText("Challenges");
    const challengesAdminLink = screen.queryByText("Challenges Admin");

    expect(challengesLink).toBeInTheDocument();
    expect(challengesAdminLink).not.toBeInTheDocument();
  });

  it("renders challenges admin with admin role", () => {
    const mockUserSession = useSessionHelper as { useSession: unknown };
    mockUserSession.useSession = jest.fn(() => ({
      data: { user: { email: "foo@bar.com", role: "ADMIN" } },
    }));

    render(<NavBar />);

    const challengesLink = screen.getByText("Challenges");
    const challengesAdminLink = screen.queryByText("Challenges Admin");

    expect(challengesLink).toBeInTheDocument();
    expect(challengesAdminLink).toBeInTheDocument();
  });

  it("successfully navigates to challenges", async () => {
    render(<NavBar />);

    const challengesLink = screen.getByText("Challenges");
    act(() => {
      fireEvent.click(challengesLink);
    });

    await waitFor(() => {
      expect(singletonRouter).toMatchObject({ asPath: "/challenges" });
    });
  });

  it("successfully navigates to challenge admin", async () => {
    render(<NavBar />);

    const challengesAdminLink = screen.getByText("Challenges Admin");
    act(() => {
      fireEvent.click(challengesAdminLink);
    });

    await waitFor(() => {
      expect(singletonRouter).toMatchObject({ asPath: "/challenges/admin" });
    });
  });
});
