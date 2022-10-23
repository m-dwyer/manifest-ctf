import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { fetchChallenges } from "@/challenges/services/challengeAdmin";
import { buildResponse } from "@/common/lib/ResponseBuilder";
import { ChallengeWithCompletion } from "@/challenges/schemas/challenge";
import { withValidation } from "@/common/lib/ApiValidator";
import { ResponseWithData } from "@/common/types/ResponseWithData";
import { Challenge, ChallengeAttempt } from "@prisma/client";

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).get(
  async (
    req,
    res: NextApiResponse<
      ResponseWithData<{
        total: number;
        challenges: (Challenge & { challengeAttempt: ChallengeAttempt[] })[];
      }>
    >
  ) => {
    const rangeFrom = Number(req.query.from);
    const count = Number(req.query.count);
    const { data, error } = await fetchChallenges({ rangeFrom, count });

    if (error || data === null) {
      return res.status(500).json(
        buildResponse({
          success: false,
          error: "foo",
        })
      );
    }

    return res.status(200).json(
      buildResponse({
        success: true,
        data,
      })
    );
  }
);
