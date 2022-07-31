// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServiceClient } from "lib/supabaseServiceClient";
import { withApiAuth } from "@supabase/auth-helpers-nextjs";

export default withApiAuth(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method != "DELETE") {
        res.status(405).json({ error: "Not allowed" });
        return;
      }

      const challenge = req.body.challenge;

      const { data, error } = await supabaseServiceClient.from("challenges")
      .delete()
      .match({id: challenge})

      console.log("data: ", data)
      console.log("error: ", error)

      if (error) return res.status(500).json({ error: error.message });

      return res
      .status(201)
      .json({ deleted: true });
  })