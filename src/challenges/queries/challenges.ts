import { useMutation, useQuery } from "@tanstack/react-query";

import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import {
  Challenge,
  ChallengeWithCategories,
  ChallengeWithCompletion,
} from "@/challenges/types/Challenge";
import { ResponseWithData } from "@/common/types/ResponseWithData";
import { apiClient } from "@/common/providers/apiClient";

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
  const result =
    operation === Operation.UPDATE
      ? await apiClient.put<ChallengeWithCategories>({
          url: "/api/challenges/admin",
          body: JSON.stringify(challenge),
        })
      : await apiClient.post<ChallengeWithCategories>({
          url: "/api/challenges/admin",
          body: JSON.stringify(challenge),
        });

  return result;
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
  const result = await apiClient.get<ChallengeWithCategories[]>({
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
  const result = await apiClient.delete<Record<string, never>>({
    url: "/api/challenges/admin",
    body: JSON.stringify({ challenge: challengeId }),
  });

  return result;
};
