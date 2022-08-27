import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import { Challenge, ChallengeWithCompletion } from "@/type/Challenge";

export const createChallenge = (challenge: Challenge) => {
  return createOrUpdateChallenge(Operation.CREATE, challenge);
};

export const updateChallenge = (challenge: Challenge) => {
  return createOrUpdateChallenge(Operation.UPDATE, challenge);
};

enum Operation {
  CREATE,
  UPDATE,
}

const createOrUpdateChallenge = async (
  operation: Operation,
  challenge: Challenge
) => {
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

  const result = await fetch(`/api/challenges/admin`, options);
  const json = await result.json();

  return json;
};

export const fetchChallengesByRange = async (
  rangeBegin: number,
  rangeEnd: number
) => {
  const { data: challenges, count } = await supabaseClient
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

  return { challenges, count };
};
