import { prisma } from "@/common/providers/prismaClient";
import { ServiceResponse } from "@/common/types/ServiceResponse";

export const fetchProfile = async (
  userId: string
): Promise<ServiceResponse<{ id: number }>> => {
  const result = await prisma.user.findFirst({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      challengeAttempts: {
        where: {
          completed: {
            not: null,
          },
        },
        select: {
          completed: true,
          points_scored: true,
        },
      },
    },
  });

  return { data: result, error: null };
};
