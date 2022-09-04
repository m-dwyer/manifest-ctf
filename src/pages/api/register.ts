import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/common/providers/supabaseClient";
import { buildResponse } from "@/common/lib/ResponseBuilder";

export default async function registerUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error)
    return res
      .status(401)
      .json(buildResponse({ success: false, error: error.message }));

  return res.status(200).json(buildResponse({ success: true, data: user }));
}
