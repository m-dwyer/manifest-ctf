import { NextApiResponse, NextApiRequest } from "next";
import { getUser, withApiAuth } from "@supabase/auth-helpers-nextjs";
import nc from "next-connect";
import {
  fetchChallengeWithAttempts,
  upsertChallengeAttempt,
} from "@/challenges/services/serverSubmission";
import { buildResponse } from "@/common/lib/ResponseBuilder";

export default withApiAuth(
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res
        .status(500)
        .json(buildResponse({ success: false, error: err.message }));
    },
  }).post(async (req, res) => {
    const challenge = req.body.challenge;
    const submittedFlag = req.body.flag;

    const { data } = await fetchChallengeWithAttempts(challenge);

    const { user } = await getUser({ req, res });
    const userId = user.id;

    const existingAttempts = data?.challenge_attempts[0]?.attempts || 0;
    const shouldLogAttempt =
      data?.challenge_attempts[0] === undefined ||
      !data?.challenge_attempts[0]?.completed;

    if (shouldLogAttempt && data && data.id) {
      const flagCorrect = data?.flag === submittedFlag;
      const { data: upsertData, error: upsertError } =
        await upsertChallengeAttempt(
          userId,
          data?.id,
          flagCorrect,
          existingAttempts,
          data.points
        );
    }

    const correct = data?.flag == submittedFlag;

    return res
      .status(201)
      .json({ challenge: challenge, flag: submittedFlag, correct });
  })
);
