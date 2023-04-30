import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      if (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname === "/" ||
        pathname === "/signup" ||
        pathname === "/api/register"
      )
        return true;

      if (token) return true;

      return false;
    },
  },
  pages: {
    signIn: "/login",
  },
});
