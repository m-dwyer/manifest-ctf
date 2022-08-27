import { SubmissionResult } from "@/type/Submission";

export const submitAttempt = async (
  challengeId: number,
  flag: string
): Promise<SubmissionResult> => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ challenge: challengeId, flag: flag }),
  };

  const result = await fetch(`/api/submission`, options);
  const json = await result.json();

  return json;
};
