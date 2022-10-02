import { supabaseServiceClient } from "@/common/providers/supabaseServiceClient";
import { ServiceResponse } from "@/common/types/ServiceResponse";
import {
  ChallengeCompletion,
  ChallengeWithCompletion,
} from "@/challenges/schemas/challenge";

export const fetchChallengeWithAttempts = async (
  challenge: number
): Promise<ServiceResponse<ChallengeWithCompletion>> => {
  const { data, error } = await supabaseServiceClient
    .from<ChallengeWithCompletion>("challenges")
    .select(
      `
        *,
        challenge_attempts(
            completed,
            attempts
        )
    `
    )
    .eq("id", challenge)
    .limit(1)
    .single();

  return { data, error };
};

export const upsertChallengeAttempt = async (
  userId: string,
  challengeId: number,
  correct: boolean,
  existingAttempts: number,
  points: number
): Promise<ServiceResponse<ChallengeCompletion>> => {
  const { data, error } = await supabaseServiceClient
    .from<ChallengeCompletion>("challenge_attempts")
    .upsert({
      user_id: userId,
      challenge_id: challengeId,
      completed: correct,
      attempts: existingAttempts + 1,
      points_scored: correct ? points : 0,
    });

  return { data: data && data[0], error };
};
