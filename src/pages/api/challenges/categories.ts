import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import nc from "next-connect";
import { fetchAllCategories } from "@/challenges/services/categoryAdmin";
import { buildResponse } from "@/common/lib/ResponseBuilder";

export default withApiAuth(
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res
        .status(500)
        .json(buildResponse({ success: false, error: err.message }));
    },
  }).get(async (req, res) => {
    const { data: categoryData, error } = await fetchAllCategories();

    res.status(200).json(buildResponse({ success: true, data: categoryData }));
  })
);
