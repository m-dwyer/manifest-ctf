import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { fetchProfile } from "@/base/services/profile";
import { buildResponse } from "@/common/lib/ResponseBuilder";
import { ResponseWithData } from "@/common/dto/ResponseWithData";
import { getSession } from "next-auth/react";

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).get(async (req, res: NextApiResponse<ResponseWithData<any>>) => {
  const session = await getSession({ req });

  if (session === null || session.user === null || session.user?.id === null) {
    return res.status(500).json(
      buildResponse({
        success: false,
        error: "no session",
      })
    );
  }

  const { data, error } = await fetchProfile(session.user?.id);

  if (error)
    return res
      .status(500)
      .json(buildResponse({ success: false, error: error }));

  return res
    .status(200)
    .json(buildResponse({ success: true, data: data || [] }));
});
