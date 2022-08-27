import { supabaseServiceClient } from "@/lib/supabaseServiceClient";

export const fetchChallengeWithAttempts = async (challenge: string) => {
  const { data: challengeData } = await supabaseServiceClient
    .from("challenges")
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

  return { challengeData };
};

export const upsertChallengeAttempt = async (
  userId: string,
  challengeId: string,
  correct: boolean,
  existingAttempts: number,
  points: number
) => {
  const { data: upsertData, error: upsertError } = await supabaseServiceClient
    .from("challenge_attempts")
    .upsert({
      user_id: userId,
      challenge_id: challengeId,
      completed: correct,
      attempts: existingAttempts + 1,
      points_scored: correct ? points : 0,
    });

  return { upsertData, upsertError };
};
