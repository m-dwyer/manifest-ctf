import { NextApiResponse, NextApiRequest } from "next";
import { getUser, withApiAuth } from "@supabase/auth-helpers-nextjs";
import { supabaseServerClient } from "@supabase/auth-helpers-nextjs";

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

  const { data: challengeData } = await supabaseServerClient({ req, res })
    .from("challenges")
    .select(
      `
        *,
        challenge_attempts(
            completed,
            attempts
        )
    `
    )
    .eq("id", challenge)
    .limit(1)
    .single();

  const { user } = await getUser({ req, res });

  const existingAttempts = challengeData?.challenge_attempts[0]?.attempts || 0
  const shouldLogAttempt =
    challengeData?.challenge_attempts[0] === undefined ||
    !challengeData?.challenge_attempts[0]?.completed;

  if (shouldLogAttempt) {
    const { data: upsertData, error: upsertError } = await supabaseServerClient(
      { req, res }
    )
      .from("challenge_attempts")
      .upsert({
        user_id: user.id,
        challenge_id: challenge,
        completed: challengeData?.flag === submittedFlag,
        attempts: existingAttempts + 1
      });
  }

  const correct = challengeData?.flag == submittedFlag;

  return res
    .status(201)
    .json({ challenge: challenge, flag: submittedFlag, correct });
});
