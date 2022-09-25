import { SubmissionResult } from "@/challenges/schemas/submission-result";
import { apiClient } from "@/common/providers/apiClient";
import { useMutation } from "@tanstack/react-query";

export const useSubmitAttempt = () => {
  return useMutation({
    mutationFn: ({
      challengeId,
      flag,
    }: {
      challengeId: number;
      flag: string;
    }) => {
      return submitAttempt(challengeId, flag);
    },
  });
};
const submitAttempt = async (challengeId: number, flag: string) => {
  const result = apiClient.post<SubmissionResult>({
    url: "/api/submission",
    body: JSON.stringify({ challenge: challengeId, flag: flag }),
  });

  return result;
};
