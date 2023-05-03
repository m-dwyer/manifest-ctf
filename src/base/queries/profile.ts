import { apiClient } from "@/common/providers/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { ProfileOverview } from "@/base/schemas/profileOverview";

export const useFetchProfileOverview = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfileOverview(),
    select: (response) => {
      if (response) return response.data;
    },
    useErrorBoundary: true,
    staleTime: 60000,
  });
};

const fetchProfileOverview = async () => {
  const result = await apiClient.get<ProfileOverview>({
    url: "/api/profile/overview",
  });

  return result;
};
