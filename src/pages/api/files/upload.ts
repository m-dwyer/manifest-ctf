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
    const mediaFiles = files.media;

    const savedFiles = Array.isArray(mediaFiles)
      ? mediaFiles.map((f) => f)
      : [mediaFiles];

    savedFiles.forEach(async (f) => {
      const fsFile = await fs.readFile(f.filepath);

      const result = await prisma.storage.create({
        data: {
          bucket: fields.bucket[0],
          path: fields.path[0],
          mimeType: f.mimetype || "application/octet-stream",
          data: fsFile,
        },
      });
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
