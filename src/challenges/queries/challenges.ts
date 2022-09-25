import { useMutation, useQuery } from "@tanstack/react-query";

import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import { ResponseWithData } from "@/common/types/ResponseWithData";
import { apiClient } from "@/common/providers/apiClient";
import type {
  ChallengeToUpsert,
  ChallengeWithCompletion,
  ChallengeWithCategories,
} from "@/challenges/schemas/challenge";

enum Operation {
  CREATE,
  UPDATE,
}

export const useUpsertChallenge = () => {
  return useMutation({
    mutationFn: (challenge: ChallengeToUpsert) => {
      if (challenge.id) {
        return updateChallenge(challenge);
      } else {
        return createChallenge(challenge);
      }
    },
    useErrorBoundary: true,
  });
};
const createChallenge = (challenge: ChallengeToUpsert) => {
  return createOrUpdateChallenge(Operation.CREATE, challenge);
};
const updateChallenge = (challenge: ChallengeToUpsert) => {
  return createOrUpdateChallenge(Operation.UPDATE, challenge);
};
const createOrUpdateChallenge = async (
  operation: Operation,
  challenge: ChallengeToUpsert
): Promise<ResponseWithData<ChallengeToUpsert>> => {
  const result =
    operation === Operation.UPDATE
      ? await apiClient.put<ChallengeToUpsert>({
          url: "/api/challenges/admin",
          body: JSON.stringify(challenge),
        })
      : await apiClient.post<ChallengeToUpsert>({
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
    useErrorBoundary: true,
    staleTime: 60000,
  });
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

export const useFetchChallengesForAdmin = () => {
  return useQuery({
    queryKey: ["challengesForAdmin"],
    queryFn: () => fetchChallengesForAdmin(),
    select: (response) => {
      if (response) return response.data;
    },
    useErrorBoundary: true,
    staleTime: 60000,
  });
};
const fetchChallengesForAdmin = async () => {
  const result = await apiClient.get<ChallengeWithCategories[]>({
    url: "/api/challenges/admin",
  });

  return result;
};

export const useDeleteChallenge = () => {
  return useMutation((challengeId: number) => deleteChallenge(challengeId), {
    useErrorBoundary: true,
  });
};
const deleteChallenge = async (challengeId: number) => {
  const result = await apiClient.delete<Record<string, never>>({
    url: "/api/challenges/admin",
    body: JSON.stringify({ challenge: challengeId }),
  });

  return result;
};
