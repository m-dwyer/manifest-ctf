import { apiClient } from "@/common/providers/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/challenges/types/Category";

export const useFetchAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories(),
    staleTime: 60000,
  });
};

const fetchAllCategories = async () => {
  const result = await apiClient.get<Category[]>({
    url: "/api/challenges/categories",
  });

  return result;
};
