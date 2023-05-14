import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await getToken({ req: req });

  if (
    pathname === "/favicon.ico" ||
    pathname === "/" ||
    pathname === "/signup" ||
    pathname === "/api/register" ||
    pathname === "/login"
  )
    return NextResponse.next();

  const protectedPaths = ["/challenges/admin", "/api/challenges/admin"];
  const matchesProtectedPath = protectedPaths.some((p) =>
    pathname.startsWith(p)
  );

  if (matchesProtectedPath) {
    if (token?.role !== "ADMIN") {
      const url = new URL("/unauthorized", process.env.NEXTAUTH_URL);
      return NextResponse.redirect(url);
    }
  }

  if (token) return NextResponse.next();

  const url = new URL("/login", process.env.NEXTAUTH_URL);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)(.+)"],
};
