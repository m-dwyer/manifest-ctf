import { SubmissionResult } from "@/challenges/schemas/submission-result";
import { apiClient } from "@/common/providers/apiClient";
import { useMutation } from "@tanstack/react-query";
import { Submission } from "@/challenges/schemas/submission";

export const useSubmitAttempt = () => {
  return useMutation({
    mutationFn: (submission: Submission) => {
      return submitAttempt(submission);
    },
    useErrorBoundary: true,
  });
};
const submitAttempt = async (submission: Submission) => {
  const result = apiClient.post<SubmissionResult>({
    url: "/api/submission",
    body: JSON.stringify(submission),
  });

  return result;
};
