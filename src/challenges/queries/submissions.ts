import { SubmissionResult } from "@/challenges/types/Submission";
import { query } from "@/common/queries/BaseQuery";
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
  const result = query<SubmissionResult>({
    url: "/api/submission",
    options: {
      method: "POST",
      body: JSON.stringify({ challenge: challengeId, flag: flag }),
    },
  });

  return result;
};
