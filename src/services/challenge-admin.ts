import { supabaseServiceClient } from "@lib/supabaseServiceClient";

import { Challenge } from "@type/Challenge";

type ChallengeUpsertProps = {
  name: string;
  description: string;
  category: number;
  flag: string;
  points: number;
};

export const upsertChallenge = async ({
  name,
  description,
  category,
  flag,
  points,
}: ChallengeUpsertProps) => {
  const { data: challengeData, error: challengeError } =
    await supabaseServiceClient
      .from("challenges")
      .upsert([{ name, description, flag, points }], { onConflict: "name" })
      .select(`
          id,
          name,
          description,
          flag,
          points,
          category(id, name)
        `);

  if (challengeError) {
    return { error: challengeError };
  }

  const upsertedChallenge = challengeData[0] as Challenge;

  const { data: categoryData, error: categoryError } =
    await supabaseServiceClient
      .from("challenge_categories")
      .upsert([{ challenge: upsertedChallenge.id, category: category }]);

  return { data: challengeData, error: challengeError };
};

export const deleteChallenge = async (challenge: string) => {
  const { data, error } = await supabaseServiceClient
    .from("challenges")
    .delete()
    .match({ id: challenge });

  return { data, error };
};

export const fetchChallenges = async () => {
  const { data: challengeData, error } = await supabaseServiceClient
    .from("challenges")
    .select(
      `
    *,
    category(id, name)
      `
    )
    .order("id", { ascending: true });

  return { challengeData, error };
};
