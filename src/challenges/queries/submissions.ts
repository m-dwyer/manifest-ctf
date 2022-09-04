import { SubmissionResult } from "@/challenges/types/Submission";
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
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ challenge: challengeId, flag: flag }),
  };

  const response = await fetch(`/api/submission`, options);
  const result: SubmissionResult = await response.json();

  return result;
};
