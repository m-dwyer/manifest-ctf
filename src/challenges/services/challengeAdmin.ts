import { prisma } from "@/common/providers/prismaClient";

import { BaseChallenge, DeleteChallenge } from "@/challenges/schemas/challenge";
import { ServiceResponse } from "@/common/types/ServiceResponse";
import { Challenge, ChallengeAttempt } from "@prisma/client";

export const upsertChallenge = async (
  challenge: Challenge
): Promise<ServiceResponse<Challenge>> => {
  const { id, categoryId, ...challengeToUpsert } = challenge;

  if (categoryId === null) {
    return { data: null, error: null };
  }

  const result = await prisma.challenge.upsert({
    where: { name: challenge.name },
    update: {
      ...challengeToUpsert,
      category: {
        connect: { id: Number(categoryId) },
      },
    },
    create: {
      ...challengeToUpsert,
      category: {
        connect: { id: Number(categoryId) },
      },
    },
  });

  return { data: result, error: null };
};

export const deleteChallenge = async (
  delChallenge: DeleteChallenge
): Promise<ServiceResponse<BaseChallenge>> => {
  const result = await prisma.challenge.delete({
    where: {
      id: delChallenge.challenge,
    },
  });

  return { data: result, error: null };
};

export const fetchAllChallenges = async (): Promise<
  ServiceResponse<(Challenge & { category: { name: string } | null })[]>
> => {
  const result = await prisma.challenge.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
  return { data: result, error: null };
};

export const fetchChallenges = async ({
  rangeFrom,
  count,
}: {
  rangeFrom: number;
  count: number;
}): Promise<
  ServiceResponse<{
    total: number;
    challenges: (Challenge & { challengeAttempt: ChallengeAttempt[] })[];
  }>
> => {
  const [total, challenges] = await prisma.$transaction([
    prisma.challenge.count(),
    prisma.challenge.findMany({
      include: {
        challengeAttempt: {
          where: {
            userId: 1,
          },
        },
      },
      skip: Math.max(rangeFrom, 0),
      take: count,
      orderBy: {
        id: "asc",
      },
    }),
  ]);

  return { data: { total, challenges }, error: null };
};
