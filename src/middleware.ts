import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await getToken({ req: req });

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/" ||
    pathname === "/signup" ||
    pathname === "/api/register"
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

  return NextResponse.next();
}
