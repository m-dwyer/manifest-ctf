import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import nc from "next-connect";
import { fetchAllCategories } from "@/challenges/services/categoryAdmin";
import { buildResponse } from "@/common/lib/ResponseBuilder";
import type { ChallengeCategory } from "@/challenges/schemas/challenge-category";
import { ResponseWithData } from "@/common/types/ResponseWithData";

export default withApiAuth(
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res
        .status(500)
        .json(buildResponse({ success: false, error: err.message }));
    },
  }).get(
    async (
      req: NextApiRequest,
      res: NextApiResponse<ResponseWithData<ChallengeCategory[]>>
    ) => {
      const { data, error } = await fetchAllCategories();

      if (error || data === null)
        return res
          .status(500)
          .json(buildResponse({ success: false, error: error?.message }));

      res.status(200).json(
        buildResponse<ChallengeCategory[]>({
          success: true,
          data: data || [],
        })
      );
    }
  )
);
