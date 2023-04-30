import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { buildResponse } from "@/common/lib/ResponseBuilder";
import { prisma } from "@/common/providers/prismaClient";

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { path } = req.query;
  const { bucket } = req.query;

  if (!path || typeof path !== "string") {
    return res
      .status(500)
      .json(buildResponse({ success: false, error: "Invalid path" }));
  }

  if (!bucket || typeof bucket !== "string") {
    return res
      .status(500)
      .json(buildResponse({ success: false, error: "Invalid bucket" }));
  }

  const result = await prisma.storage.findFirst({
    where: {
      bucket: bucket,
      path: path,
    },
  });

  if (!result) {
    return res
      .status(404)
      .json(buildResponse({ success: false, error: "Item not found" }));
  }

  res.setHeader("Content-Type", result.mimeType);
  res.send(result.data);
});
