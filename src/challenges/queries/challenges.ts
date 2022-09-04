import { useMutation, useQuery } from "@tanstack/react-query";

import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import {
  Challenge,
  ChallengeWithCategories,
  ChallengeWithCompletion,
} from "@/challenges/types/Challenge";
import { ResponseWithData } from "@/common/types/ResponseWithData";
import { query } from "@/common/queries/BaseQuery";

export const useUpsertChallenge = () => {
  return useMutation({
    mutationFn: (challenge: Challenge) => {
      if (challenge.id) {
        return updateChallenge(challenge);
      } else {
        return createChallenge(challenge);
      }
    },
  });
};

const createChallenge = (challenge: Challenge) => {
  return createOrUpdateChallenge(Operation.CREATE, challenge);
};

const updateChallenge = (challenge: Challenge) => {
  return createOrUpdateChallenge(Operation.UPDATE, challenge);
};

enum Operation {
  CREATE,
  UPDATE,
}

const createOrUpdateChallenge = async (
  operation: Operation,
  challenge: Challenge
): Promise<ResponseWithData<ChallengeWithCategories>> => {
  const method = operation === Operation.UPDATE ? "PUT" : "POST";

  return query<ChallengeWithCategories>({
    url: "/api/challenges/admin",
    options: {
      method,
      body: JSON.stringify(challenge),
    },
  });
};

export const useFetchChallengesByRange = ({
  rangeBegin,
  rangeEnd,
}: {
  rangeBegin: number;
  rangeEnd: number;
}) => {
  return useQuery({
    queryKey: ["challenges", rangeBegin, rangeEnd],
    queryFn: () => fetchChallengesByRange({ rangeBegin, rangeEnd }),
    staleTime: 60000,
  });
};

export const useFetchChallengesForAdmin = () => {
  return useQuery({
    queryKey: ["challengesForAdmin"],
    queryFn: () => fetchChallengesForAdmin(),
    staleTime: 60000,
  });
};

const fetchChallengesForAdmin = async () => {
  const result = await query<ChallengeWithCategories[]>({
    url: "/api/challenges/admin",
  });

  return result.data;
};

const fetchChallengesByRange = async ({
  rangeBegin,
  rangeEnd,
}: {
  rangeBegin: number;
  rangeEnd: number;
}): Promise<{ challenges: ChallengeWithCompletion[]; count: number }> => {
  let { data: challenges, count } = await supabaseClient
    .from<ChallengeWithCompletion>("challenges")
    .select(
      `
        *,
        challenge_attempts(
          completed
        )
      `,
      { count: "exact" }
    )
    .order("id", { ascending: true })
    .range(rangeBegin, rangeEnd);

  challenges ||= [];
  count ||= 0;

  return { challenges, count };
};

export const useDeleteChallenge = () => {
  return useMutation((challengeId: number) => deleteChallenge(challengeId), {});
};

const deleteChallenge = async (challengeId: number) => {
  const result = await query<Record<string, never>>({
    url: "/api/challenges/admin",
    options: {
      method: "DELETE",
      body: JSON.stringify({ challenge: challengeId }),
    },
  });

  return result;
};
