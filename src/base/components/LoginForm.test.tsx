import LoginForm from "@/base/components/LoginForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import singletonRouter from "next/router";
import { act } from "react-test-renderer";

jest.mock("@/base/queries/authentication", () => ({
  __esModule: true,
  login: null,
}));
import * as auth from "@/base/queries/authentication";

/**
 * @group unit
 * @group components
 */
describe("LoginForm", () => {
  it("renders", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");
    const submitButton = screen.getByRole("button");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("successfully logs in", async () => {
    const mockAuth = auth as { login: unknown };
    mockAuth.login = () => ({ error: null });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");
    const submitButton = screen.getByRole("button");

    act(() => {
      fireEvent.change(emailInput, { target: { value: "foo@bar.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(singletonRouter).toMatchObject({ asPath: "/home" });
    });
  });

  it("displays an error as required", async () => {
    const mockAuth = auth as { login: unknown };
    mockAuth.login = () => ({ error: { message: "something went wrong" } });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");
    const submitButton = screen.getByRole("button");

    act(() => {
      fireEvent.change(emailInput, { target: { value: "foo@bar.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("something went wrong")).toBeInTheDocument();
    });
  });
});
