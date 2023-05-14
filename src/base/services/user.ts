import { prisma } from "@/common/providers/prismaClient";
import { compareSync } from "bcrypt";
import { User } from "next-auth";

export const authorizeUser = async ({
  email,
  password,
}: {
  email?: string;
  password?: string;
}): Promise<User> => {
  if (!email || !password) {
    throw new Error("Invalid email or password");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const checkPassword = compareSync(password, user.password);

  if (checkPassword) {
    return { ...user, id: user.id.toString() };
  }

  throw new Error("Invalid email or password");
};
