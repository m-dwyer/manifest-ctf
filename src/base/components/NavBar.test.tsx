import NavBar from "@/base/components/NavBar";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import singletonRouter from "next/router";
import { act } from "react-test-renderer";

describe("NavBar", () => {
  it("renders", () => {
    render(<NavBar />);

    const challengesLink = screen.getByText("Challenges");
    const challengesAdminLink = screen.getByText("Challenges Admin");

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
