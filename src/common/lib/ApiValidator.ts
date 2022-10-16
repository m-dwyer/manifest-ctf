import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export const withValidation = (schema: z.ZodType, handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: "validation error",
      });

      return;
    }

    if (handler) return await handler(req, res);
  };
};
