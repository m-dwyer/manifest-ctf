import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { buildResponse } from "@/common/lib/ResponseBuilder";
import { withValidation } from "@/common/lib/ApiValidator";
import { Signup, signupSchema } from "@/base/dto/Signup";
import { ResponseWithData } from "@/common/dto/ResponseWithData";

import { prisma } from "@/common/providers/prismaClient";
import { User } from "@prisma/client";

import * as bcrypt from "bcrypt";

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).json(buildResponse({ success: false, error: err.message }));
  },
}).post(
  withValidation(
    signupSchema,
    async (
      req: NextApiRequest,
      res: NextApiResponse<ResponseWithData<User>>
    ) => {
      const signup = req.body as Signup;

      const hashedPassword = bcrypt.hashSync(signup.password, 10);

      const user = await prisma.user.create({
        data: {
          email: signup.email,
          password: hashedPassword,
        },
      });

      if (!user)
        return res
          .status(401)
          .json(
            buildResponse({ success: false, error: "Something went wrong" })
          );

      return res.status(200).json(buildResponse({ success: true, data: user }));
    }
  )
);
