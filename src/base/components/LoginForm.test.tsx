import LoginForm from '@/base/components/LoginForm'
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import singletonRouter from "next/router";
import { act } from 'react-test-renderer';

jest.mock("@/base/queries/authentication", () => ({
    login: () => ({error: false})
}))

describe("LoginForm", () => {
  it("renders", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("email")
    const passwordInput = screen.getByLabelText("password")
    const submitButton = screen.getByRole("button")

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  });
});
