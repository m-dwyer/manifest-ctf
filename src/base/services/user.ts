import { prisma } from "@/common/providers/prismaClient";
import { compareSync } from "bcrypt";

export const authorizeUser = async ({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) => {
  if (!email || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
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

  const checkPassword = compareSync(password, user.password);

  if (checkPassword) {
    return { id: user.id.toString(), email: email };
  }

  return null;
};
