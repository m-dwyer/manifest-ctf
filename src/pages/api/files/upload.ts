import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { promises as fs } from "fs";

import { buildResponse } from "@/common/lib/ResponseBuilder";
import { parseForm } from "@/base/lib/formParser";
import { prisma } from "@/common/providers/prismaClient";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = await parseForm(req);
    const file = files.media;

    const savedFiles = Array.isArray(file)
      ? file.map((f) => f.filepath)
      : [file.filepath];

    console.log("url: ", files);

    savedFiles.forEach(async (u) => {
      const fsFile = await fs.readFile(u);

      const result = await prisma.files.create({
        data: {
          path: "/foo",
          data: fsFile,
        },
      });

      console.log("result: ", result);
    });

    return res.status(200).json({
      success: true,
      data: {},
      error: null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ data: null, error: "Internal server error" });
  }
});
