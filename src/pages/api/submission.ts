import { NextApiResponse, NextApiRequest } from "next";
import nc from "next-connect";
import {
  fetchChallengeWithAttempts,
  upsertChallengeAttempt,
} from "@/challenges/services/serverSubmission";
import { buildResponse } from "@/common/lib/ResponseBuilder";
import { withValidation } from "@/common/lib/ApiValidator";
import { Submission, submissionSchema } from "@/challenges/schemas/submission";
import { ResponseWithData } from "@/common/dto/ResponseWithData";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).post(
  withValidation(
    submissionSchema,
    async (
      req: NextApiRequest,
      res: NextApiResponse<ResponseWithData<Submission>>
    ) => {
      const submission = req.body as Submission;

      const session = await getServerSession(req, res, authOptions);

      if (session === null || session.user === null) {
        return res.status(500).json(
          buildResponse({
            success: false,
            error: "no session",
          })
        );
      }

      const { data } = await fetchChallengeWithAttempts(
        submission.challenge,
        Number(session.user?.id)
      );

      const existingAttempts = data?.challengeAttempt[0]?.attempts || 0;
      const shouldLogAttempt =
        data?.id === undefined || !data?.challengeAttempt[0]?.completed;

      if (shouldLogAttempt && data) {
        const flagCorrect = data?.flag === submission.flag;
        const challengeAttemptResponse = await upsertChallengeAttempt(
          session?.user?.id || "1",
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
);
