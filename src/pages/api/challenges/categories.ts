import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { fetchAllCategories } from "@/challenges/services/categoryAdmin";
import { buildResponse } from "@/common/lib/ResponseBuilder";
import { ResponseWithData } from "@/common/types/ResponseWithData";
import { Category } from "@prisma/client";

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).get(
  async (
    req: NextApiRequest,
    res: NextApiResponse<ResponseWithData<Category[]>>
  ) => {
    const { data, error } = await fetchAllCategories();

    if (error || data === null)
      return res
        .status(500)
        .json(buildResponse({ success: false, error: error?.message }));

    res.status(200).json(
      buildResponse<Category[]>({
        success: true,
        data: data || [],
      })
    );
  }
);
