import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// TODO: for some reason, aliased path isn't giving type completion
import { prisma } from "@/common/providers/prismaClient";
import { compareSync } from "bcrypt";

export const authOptions = {
  debug: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 day session
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      pages: {
        signIn: "/login",
      },
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
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

        const checkPassword = compareSync(credentials.password, user.password);

        if (checkPassword) {
          return user;
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
