import { apiClient } from "@/common/providers/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { ProfileOverview } from "@/base/schemas/profileOverview";

export const useFetchProfileOverview = ({
  period = "1W",
}: {
  period?: string;
}) => {
  return useQuery({
    queryKey: ["profile", period],
    queryFn: () => fetchProfileOverview({ period }),
    select: (response) => {
      if (response) return response.data;
    },
    useErrorBoundary: true,
    staleTime: 1,
  });
};

const fetchProfileOverview = async ({ period }: { period: string }) => {
  const result = await apiClient.get<ProfileOverview>({
    url: `/api/profile/overview?period=${period}`,
  });

  return result;
};
