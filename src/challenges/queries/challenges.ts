import { useMutation, useQuery } from "@tanstack/react-query";

import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import {
  Challenge,
  ChallengeWithCategories,
  ChallengeWithCompletion,
} from "@/challenges/types/Challenge";

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

type ResponseWithResult<T> = {
  success: boolean;
  error?: string;
  result?: T;
};

const createOrUpdateChallenge = async (
  operation: Operation,
  challenge: Challenge
): Promise<ResponseWithResult<ChallengeWithCategories>> => {
  const method = operation === Operation.UPDATE ? "PUT" : "POST";

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...challenge,
    }),
  };

  let response = null;
  try {
    response = await fetch(`/api/challenges/admin`, options);
  } catch (error) {
    throw new Error(`Network request error`);
  }

  if (!response.ok) {
    throw new Error("Network response was not okay");
  }

  const result: ResponseWithResult<ChallengeWithCategories> =
    await response.json();

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
  const result = await fetch(`/api/challenges/admin`);
  const json = await result.json();

  return json.data as ChallengeWithCategories[];
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
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ challenge: challengeId }),
  };

  const response = await fetch(`/api/challenges/admin`, options);
  const result: ResponseWithResult<Record<string, never>> =
    await response.json();

  return result;
};
