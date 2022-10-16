import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { buildResponse } from "@/common/lib/ResponseBuilder";
import { withValidation } from "@/common/lib/ApiValidator";
import { Signup, SignupResponse, signupSchema } from "@/base/schemas/signup";
import { prisma } from "@/common/providers/prismaClient";

import { ResponseWithData } from "@/common/types/ResponseWithData";

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).post(
  withValidation(
    signupSchema,
    async (
      req: NextApiRequest,
      res: NextApiResponse<ResponseWithData<SignupResponse>>
    ) => {
      const signup = req.body as Signup;

      const user = await prisma.user.create({
        data: {
          email: signup.email,
          password: signup.password,
        },
      });

      if (!user)
        return res
          .status(401)
          .json(
            buildResponse({ success: false, error: "something went wrong" })
          );

      return res
        .status(200)
        .json(buildResponse({ success: true, data: { user } }));
    }
  )
);
