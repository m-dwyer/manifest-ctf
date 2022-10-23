import { prisma } from "../../common/providers/prismaClient";
import { ServiceResponse } from "@/common/types/ServiceResponse";
import {
  ChallengeCompletion,
  ChallengeWithCompletion,
} from "@/challenges/schemas/challenge";
import { ChallengeAttempt } from "@prisma/client";

export const fetchChallengeWithAttempts = async (
  challenge: number,
  userId: number
): Promise<
  ServiceResponse<
    { challengeAttempt: { attempts: number; completed: boolean }[] } & {
      id: number;
      flag: string;
      points: number;
    }
  >
> => {
  const result = await prisma.challenge.findFirst({
    where: {
      id: challenge,
    },
    select: {
      id: true,
      flag: true,
      points: true,
      challengeAttempt: {
        where: {
          challengeId: challenge,
          userId: userId,
        },
        select: {
          attempts: true,
          completed: true,
        },
      },
    },
  });

  return { data: result, error: null };
};

export const upsertChallengeAttempt = async (
  userId: string,
  challengeId: number,
  correct: boolean,
  existingAttempts: number,
  points: number
): Promise<ServiceResponse<ChallengeAttempt>> => {
  const result = await prisma.challengeAttempt.upsert({
    where: {
      userId_challengeId: {
        userId: Number(userId),
        challengeId: challengeId,
      },
    },
    create: {
      userId: Number(userId),
      challengeId: challengeId,
      completed: correct,
      attempts: existingAttempts + 1,
      points_scored: correct ? points : 0,
    },
    update: {
      userId: Number(userId),
      challengeId: challengeId,
      completed: correct,
      attempts: existingAttempts + 1,
      points_scored: correct ? points : 0,
    },
  });

  return { data: result, error: null };
};
