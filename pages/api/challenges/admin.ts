// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServiceClient } from "lib/supabaseServiceClient";
import { withApiAuth } from "@supabase/auth-helpers-nextjs";

import nc from 'next-connect'

export default withApiAuth(nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({error: err.message})
  }
})
.delete(async (req, res) => {
  const { challenge } = req.body;
  const { data, error } = await supabaseServiceClient
  .from("challenges")
  .delete()
  .match({id: challenge})

  if (error) return res.status(500).json({ error: error.message });

  return res
  .status(201)
  .json({ deleted: true });
})
.post(async (req, res) => {
  const { name, description, flag, points } = req.body;
  const { data, error } = await supabaseServiceClient
  .from("challenges")
  .insert([
    {name, description, flag, points}
  ])

  if (error) return res.status(500).json({error: error.message })

  return res
  .status(201)
  .json({created: true})
}))