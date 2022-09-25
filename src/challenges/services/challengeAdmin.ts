import { supabaseServiceClient } from "@/common/providers/supabaseServiceClient";

import {
  BaseChallenge,
  ChallengeToUpsert,
  ChallengeWithCategories,
} from "@/challenges/schemas/challenge";
import { ServiceResponse } from "@/common/types/ServiceResponse";

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
  challenge: string
): Promise<ServiceResponse<BaseChallenge>> => {
  const { data, error } = await supabaseServiceClient
    .from<BaseChallenge>("challenges")
    .delete()
    .match({ id: challenge });

  return { data: data && data[0], error };
};

export const fetchChallenges = async (): Promise<
  ServiceResponse<BaseChallenge[]>
> => {
  const { data: challengeData, error } = await supabaseServiceClient
    .from<BaseChallenge>("challenges")
    .select(
      `
    *,
    category(id, name)
      `
    )
    .order("id", { ascending: true });

  return { data: challengeData, error };
};
