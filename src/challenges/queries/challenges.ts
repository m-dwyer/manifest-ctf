import { useMutation, useQuery } from "@tanstack/react-query";

import { ResponseWithData } from "@/common/types/ResponseWithData";
import { apiClient } from "@/common/providers/apiClient";
import {
  ChallengeToUpsert,
  ChallengeWithCompletion,
  ChallengeWithCategories,
  DeleteChallenge,
} from "@/challenges/schemas/challenge";
import { Challenge, ChallengeAttempt } from "@prisma/client";

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
  rangeCount,
}: {
  rangeBegin: number;
  rangeCount: number;
}) => {
  return useQuery({
    queryKey: ["challenges", rangeBegin, rangeCount],
    queryFn: () => fetchChallengesByRange({ rangeBegin, rangeCount }),
    useErrorBoundary: true,
    staleTime: 60000,
  });
};
const fetchChallengesByRange = async ({
  rangeBegin,
  rangeCount,
}: {
  rangeBegin: number;
  rangeCount: number;
}): Promise<{
  challenges: (Challenge & { challengeAttempt: ChallengeAttempt[] })[];
  count: number;
}> => {
  const result = await apiClient.get<{
    total: number;
    challenges: (Challenge & { challengeAttempt: ChallengeAttempt[] })[];
  }>({
    url: `/api/challenges?from=${rangeBegin}&count=${rangeCount}`,
  });

  const challenges = result.data?.challenges || [];
  const count = result.data?.total || 0;

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
  return useMutation(
    (delChallenge: DeleteChallenge) => deleteChallenge(delChallenge),
    {
      useErrorBoundary: true,
    }
  );
};
const deleteChallenge = async (delChallenge: DeleteChallenge) => {
  const result = await apiClient.delete<DeleteChallenge>({
    url: "/api/challenges/admin",
    body: JSON.stringify(delChallenge),
  });

  return result;
};
