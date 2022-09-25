import { supabaseServiceClient } from "@/common/providers/supabaseServiceClient";
import { ChallengeCategory } from "@/challenges/schemas/challenge-category";
import { ServiceResponse } from "@/common/types/ServiceResponse";

export const fetchAllCategories = async (): Promise<
  ServiceResponse<ChallengeCategory[]>
> => {
  const { data, error } = await supabaseServiceClient
    .from<ChallengeCategory>("categories")
    .select("id, name");

  return { data, error };
};
