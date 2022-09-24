import { supabaseServiceClient } from "@/common/providers/supabaseServiceClient";
import { ChallengeCategory } from "@/challenges/schemas/challenge";

export const fetchAllCategories = async () => {
  const { data, error } = await supabaseServiceClient
    .from<ChallengeCategory>("categories")
    .select("id, name");

  return { data, error };
};
