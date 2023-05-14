/**
 * @jest-environment node
 */

import { middleware } from "./middleware";
import { NextRequest, NextResponse } from "next/server";
import { expect } from "@jest/globals";

jest.mock("next-auth/jwt", () => ({
  __esModule: true,
  getToken: null,
}));

import * as jwtHelper from "next-auth/jwt";

describe("Middleware", () => {
  const nextSpy = jest.spyOn(NextResponse, "next");

  beforeEach(() => {
    nextSpy.mockReset();
  });

  it("allows browsing to permitted endpoint", async () => {
    const mockHelper = jwtHelper as { getToken: unknown };
    mockHelper.getToken = jest.fn(() => ({ role: "USER" }));

    const url = new URL("/signup", process.env.NEXTAUTH_URL);
    const req = new NextRequest(url.toString());
    await middleware(req);

    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it("allows browsing to admin endpoint with correct role", async () => {
    const mockHelper = jwtHelper as { getToken: unknown };
    mockHelper.getToken = jest.fn(() => ({ role: "ADMIN" }));

    const url = new URL("/challenges/admin", process.env.NEXTAUTH_URL);
    const req = new NextRequest(url.toString());
    await middleware(req);

    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it("redirects to 403 page with incorrect role", async () => {
    const mockHelper = jwtHelper as { getToken: unknown };
    mockHelper.getToken = jest.fn(() => ({ role: "USER" }));

    const redirectSpy = jest.spyOn(NextResponse, "redirect");

    const url = new URL("/challenges/admin", process.env.NEXTAUTH_URL);
    const req = new NextRequest(url.toString());
    await middleware(req);

    expect(redirectSpy).toHaveBeenCalledTimes(1);
    expect(redirectSpy).toHaveBeenCalledWith(
      new URL("/unauthorized", process.env.NEXTAUTH_URL)
    );
  });
});
