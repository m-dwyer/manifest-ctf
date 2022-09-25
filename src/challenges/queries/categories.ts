import { apiClient } from "@/common/providers/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { ChallengeCategory } from "@/challenges/schemas/challenge-category";

export const useFetchAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories(),
    staleTime: 60000,
  });
};

const fetchAllCategories = async () => {
  const result = await apiClient.get<ChallengeCategory[]>({
    url: "/api/challenges/categories",
  });

  return result;
};
