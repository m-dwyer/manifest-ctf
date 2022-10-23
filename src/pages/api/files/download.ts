import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { promises as fs } from "fs";

import { buildResponse } from "@/common/lib/ResponseBuilder";
import { parseForm } from "@/base/lib/formParser";
import { prisma } from "@/common/providers/prismaClient";

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).get(async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await prisma.files.findFirst({
    where: {
      path: "/foo",
    },
  });

  res.send(result?.data);
});
