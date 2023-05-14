import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeUser } from "@/base/services/user";

export const authOptions: AuthOptions = {
  callbacks: {
    session({ session, token, user }) {
      if (session?.user) {
        session.user.id = token.uid as string;
      }

      return session;
    },
    jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials, request) => {
        return authorizeUser({
          email: credentials?.email,
          password: credentials?.password,
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
