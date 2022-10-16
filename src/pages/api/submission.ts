import { NextApiResponse, NextApiRequest } from "next";
import { getUser, withApiAuth } from "@supabase/auth-helpers-nextjs";
import nc from "next-connect";
import {
  fetchChallengeWithAttempts,
  upsertChallengeAttempt,
} from "@/challenges/services/serverSubmission";
import { buildResponse } from "@/common/lib/ResponseBuilder";
import { withValidation } from "@/common/lib/ApiValidator";
import { Submission, submissionSchema } from "@/challenges/schemas/submission";
import { ResponseWithData } from "@/common/types/ResponseWithData";

export default withApiAuth(
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res
        .status(500)
        .json(buildResponse({ success: false, error: err.message }));
    },
  }).post(
    withValidation(
      submissionSchema,
      async (
        req: NextApiRequest,
        res: NextApiResponse<ResponseWithData<Submission>>
      ) => {
        const submission = req.body as Submission;

        const { data } = await fetchChallengeWithAttempts(submission.challenge);

        const { user } = await getUser({ req, res });
        const userId = user.id;

        const existingAttempts = data?.challenge_attempts[0]?.attempts || 0;
        const shouldLogAttempt =
          data?.challenge_attempts[0] === undefined ||
          !data?.challenge_attempts[0]?.completed;

        if (shouldLogAttempt && data && data.id) {
          const flagCorrect = data?.flag === submission.flag;
          const { data: upsertData, error: upsertError } =
            await upsertChallengeAttempt(
              userId,
              data?.id,
              flagCorrect,
              existingAttempts,
              data.points
            );
        }

        const correct = data?.flag == submission.flag;

        return res.status(201).json(
          buildResponse({
            success: true,
            data: {
              challenge: submission.challenge,
              flag: submission.flag,
              correct,
            },
          })
        );
      }
    )
  )
);
