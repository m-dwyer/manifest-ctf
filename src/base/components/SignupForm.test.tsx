import SignupForm from "@/base/components/SignupForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react-test-renderer";

jest.mock("@/base/queries/authentication", () => ({
  __esModule: true,
  signUp: null,
}));
import * as auth from "@/base/queries/authentication";

/**
 * @group unit
 * @group components
 */
describe("SignupForm", () => {
  it("renders", () => {
    render(<SignupForm />);

    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");
    const confirmPasswordInput = screen.getByLabelText("confirm");
    const submitButton = screen.getByRole("button");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("signs up successfully", async () => {
    const mockAuth = auth as { signUp: unknown };
    mockAuth.signUp = jest.fn((email, password) => ({
      user: { email: "my@user.com" },
      session: {},
      error: null,
    }));

    render(<SignupForm />);

    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");
    const confirmPasswordInput = screen.getByLabelText("confirm");
    const submitButton = screen.getByRole("button");

    act(() => {
      fireEvent.change(emailInput, { target: { value: "my@user.com" } });
      fireEvent.change(passwordInput, {
        target: {
          value: "MyPassword1",
        },
      });
      fireEvent.change(confirmPasswordInput, {
        target: {
          value: "MyPassword1",
        },
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockAuth.signUp).toBeCalledWith({
        email: "my@user.com",
        password: "MyPassword1",
        confirmPassword: "MyPassword1",
      });
    });
  });

  it("it fails when passwords don't match", async () => {
    render(<SignupForm />);

    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");
    const confirmPasswordInput = screen.getByLabelText("confirm");
    const submitButton = screen.getByRole("button");

    act(() => {
      fireEvent.change(emailInput, { target: { value: "my@user.com" } });
      fireEvent.change(passwordInput, {
        target: {
          value: "MyPassword1",
        },
      });
      fireEvent.change(confirmPasswordInput, {
        target: {
          value: "MyNotMatchingPassword1",
        },
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("displays an error as required", async () => {
    const mockAuth = auth as { signUp: unknown };
    mockAuth.signUp = jest.fn((email, password) => ({
      user: null,
      session: null,
      error: "something went wrong!",
    }));

    render(<SignupForm />);

    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");
    const confirmPasswordInput = screen.getByLabelText("confirm");
    const submitButton = screen.getByRole("button");

    act(() => {
      fireEvent.change(emailInput, { target: { value: "my@user.com" } });
      fireEvent.change(passwordInput, {
        target: {
          value: "MyPassword1",
        },
      });
      fireEvent.change(confirmPasswordInput, {
        target: {
          value: "MyPassword1",
        },
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("something went wrong!")).toBeInTheDocument();
    });
  });
});
