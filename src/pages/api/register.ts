import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/common/providers/supabaseClient";

export default async function registerUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  return res.status(200).json({ user });
}
