import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import nc from "next-connect";
import {
  deleteChallenge,
  fetchChallenges,
  upsertChallenge,
} from "@/challenges/services/challengeAdmin";
import { buildResponse } from "@/common/lib/ResponseBuilder";
import {
  BaseChallenge,
  ChallengeToUpsert,
  challengeToUpsertSchema,
  ChallengeWithCategories,
  DeleteChallenge,
  deleteChallengeSchema,
} from "@/challenges/schemas/challenge";
import { withValidation } from "@/common/lib/ApiValidator";
import { ResponseWithData } from "@/common/types/ResponseWithData";

export default withApiAuth(
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res
        .status(500)
        .json(buildResponse({ success: false, error: err.message }));
    },
  })
    .get(
      async (req, res: NextApiResponse<ResponseWithData<BaseChallenge[]>>) => {
        const { data, error } = await fetchChallenges();

        if (error)
          return res
            .status(500)
            .json(buildResponse({ success: false, error: error.message }));

        return res
          .status(200)
          .json(buildResponse({ success: true, data: data || [] }));
      }
    )
    .delete(
      withValidation(
        deleteChallengeSchema,
        async (
          req: NextApiRequest,
          res: NextApiResponse<ResponseWithData<null>>
        ) => {
          const delChallenge = req.body as DeleteChallenge;
          const { data, error } = await deleteChallenge(delChallenge);

          if (error)
            return res
              .status(500)
              .json(buildResponse({ success: false, error: error.message }));

          return res
            .status(201)
            .json(buildResponse({ success: true, data: null }));
        }
      )
    )
    .post(
      withValidation(
        challengeToUpsertSchema,
        async (
          req: NextApiRequest,
          res: NextApiResponse<ResponseWithData<ChallengeWithCategories>>
        ) => {
          const challengeToUpsert = req.body as ChallengeToUpsert;
          const { data, error } = await upsertChallenge(challengeToUpsert);

          if (error || data === null)
            return res
              .status(500)
              .json(buildResponse({ success: false, error: error?.message }));

          return res.status(201).json(
            buildResponse<ChallengeWithCategories>({
              success: true,
              data: data || [],
            })
          );
        }
      )
    )
    .put(
      withValidation(
        challengeToUpsertSchema,
        async (
          req: NextApiRequest,
          res: NextApiResponse<ResponseWithData<ChallengeWithCategories>>
        ) => {
          const challengeToUpsert = req.body as ChallengeToUpsert;
          const { data, error } = await upsertChallenge(challengeToUpsert);

          if (error || data === null)
            return res
              .status(500)
              .json(buildResponse({ success: false, error: error?.message }));

          return res.status(201).json(
            buildResponse<ChallengeWithCategories>({
              success: true,
              data: data,
            })
          );
        }
      )
    )
);
