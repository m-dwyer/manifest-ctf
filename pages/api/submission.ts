import { NextApiResponse, NextApiRequest } from "next";
import { withApiAuth } from "@supabase/auth-helpers-nextjs";

import { supabaseServerClient } from "@supabase/auth-helpers-nextjs";
import { Challenge } from "types/Challenge";

export default withApiAuth(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({ error: "Not allowed" });
    return;
  }

  const challenge = req.body.challenge;
  const submittedFlag = req.body.flag;

  const { data } = await supabaseServerClient({ req, res })
    .from<Challenge>("challenges")
    .select("id, name, flag")
    .eq("id", challenge)
    .limit(1)
    .single();

  const correct = data && data.flag == submittedFlag;

  return res
    .status(201)
    .json({ challenge: challenge, flag: submittedFlag, correct });
});
