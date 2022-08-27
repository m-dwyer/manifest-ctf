import { NextApiResponse, NextApiRequest } from "next";
import { getUser, withApiAuth } from "@supabase/auth-helpers-nextjs";
import {
  fetchChallengeWithAttempts,
  upsertChallengeAttempt,
} from "@services/server-submission";

export default withApiAuth(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({ error: "Not allowed" });
    return;
  }

  const challenge = req.body.challenge;
  const submittedFlag = req.body.flag;

  const { challengeData } = await fetchChallengeWithAttempts(challenge);

  const { user } = await getUser({ req, res });
  const userId = user.id;

  const existingAttempts = challengeData?.challenge_attempts[0]?.attempts || 0;
  const shouldLogAttempt =
    challengeData?.challenge_attempts[0] === undefined ||
    !challengeData?.challenge_attempts[0]?.completed;

  if (shouldLogAttempt) {
    const flagCorrect = challengeData?.flag === submittedFlag;
    const { upsertData, upsertError } = await upsertChallengeAttempt(
      userId,
      challengeData?.id,
      flagCorrect,
      existingAttempts,
      challengeData.points
    );
  }

  const correct = challengeData?.flag == submittedFlag;

  return res
    .status(201)
    .json({ challenge: challenge, flag: submittedFlag, correct });
});
