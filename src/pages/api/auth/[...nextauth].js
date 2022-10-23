import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// TODO: for some reason, aliased path isn't giving type completion
import { prisma } from "@/common/providers/prismaClient";

export const authOptions = {
  // logger: {
  //   error(code, metadata) {
  //     console.log(code, metadata);
  //   },
  //   debug(code, metadata) {
  //     console.log(code, metadata);
  //   },
  // },
  debug: true,
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
        // console.log(`authing creds: ${credentials}`);
        console.log("req: ", req);

        // const user = { id: 1, email: "shit@fuck.com" };

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        const checkPassword = credentials.password === user.password;

        if (checkPassword) {
          return user;
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
