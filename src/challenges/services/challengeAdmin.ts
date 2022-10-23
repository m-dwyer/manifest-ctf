import { supabaseServiceClient } from "@/common/providers/supabaseServiceClient";
import { prisma } from "@/common/providers/prismaClient";

import {
  BaseChallenge,
  ChallengeToUpsert,
  ChallengeWithCategories,
  DeleteChallenge,
} from "@/challenges/schemas/challenge";
import { ServiceResponse } from "@/common/types/ServiceResponse";
import { Challenge, ChallengeAttempt } from "@prisma/client";

export const upsertChallenge = async (
  challenge: ChallengeToUpsert
): Promise<ServiceResponse<ChallengeWithCategories>> => {
  const { data: challengeData, error: challengeError } =
    await supabaseServiceClient.from("challenges").upsert([challenge]).select(`
          id,
          name,
          description,
          flag,
          points,
          category(id, name)
        `);

  if (challengeError) {
    return { data: null, error: challengeError };
  }

  const upsertedChallenge: ChallengeWithCategories =
    challengeData[0] as ChallengeWithCategories;

  const { data: categoryData, error: categoryError } =
    await supabaseServiceClient
      .from("challenge_categories")
      .upsert([
        { challenge: upsertedChallenge.id, category: challenge.category },
      ]);

  return { data: challengeData[0], error: challengeError };
};

export const deleteChallenge = async (
  delChallenge: DeleteChallenge
): Promise<ServiceResponse<BaseChallenge>> => {
  const { data, error } = await supabaseServiceClient
    .from<BaseChallenge>("challenges")
    .delete()
    .match({ id: delChallenge.challenge });

  return { data: data && data[0], error };
};

export const fetchAllChallenges = async (): Promise<
  ServiceResponse<(Challenge & { category: { name: string } })[]>
> => {
  const result = await prisma.challenge.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
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
