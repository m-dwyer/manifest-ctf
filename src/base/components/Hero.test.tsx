import Hero from "@/base/components/Hero";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import singletonRouter from "next/router";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

jest.mock("next/dist/shared/lib/router-context", () => {
  const { createContext } = jest.requireActual("react");
  const router = jest.requireActual("next-router-mock").default;
  const RouterContext = createContext(router);
  return { RouterContext };
});

describe("Hero", () => {
  it("renders a signup button", async () => {
    render(<Hero />);

    const link = screen.getByRole("button");
    expect(link).toHaveTextContent("Join Now");

    expect(link).toBeInTheDocument();
  });

  it("navigates to the signup page", async () => {
    render(<Hero />);

    const link = screen.getByRole("button");
    fireEvent.click(link);
    expect(singletonRouter).toMatchObject({ asPath: "/signup" });
  });
});
