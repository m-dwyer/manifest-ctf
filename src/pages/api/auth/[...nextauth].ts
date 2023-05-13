import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/common/providers/prismaClient";
import { compareSync } from "bcrypt";

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
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
          select: {
            id: true,
            email: true,
            password: true,
          },
        });

        if (!user) {
          return null;
        }

        const checkPassword = compareSync(
          credentials?.password || "",
          user.password
        );

        if (checkPassword) {
          return { id: user.id.toString(), email: user.email };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
