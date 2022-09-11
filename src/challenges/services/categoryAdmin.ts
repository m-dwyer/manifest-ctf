import { supabaseServiceClient } from "@/common/providers/supabaseServiceClient";

export const fetchAllCategories = async () => {
  const { data, error } = await supabaseServiceClient
    .from("categories")
    .select("id, name");

  return { data, error };
};
