import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import nc from "next-connect";
import {
  deleteChallenge,
  fetchChallenges,
  upsertChallenge,
} from "@/services/challenge-admin";

export default withApiAuth(
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: err.message });
    },
  })
    .get(async (req, res) => {
      const { challengeData, error } = await fetchChallenges();

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ data: challengeData });
    })
    .delete(async (req, res) => {
      const { challenge } = req.body;
      const { data, error } = await deleteChallenge(challenge);

      if (error) return res.status(500).json({ error: error.message });

      return res.status(201).json({ deleted: true });
    })
    .post(async (req, res) => {
      const { name, description, category, flag, points } = req.body;
      const { data, error } = await upsertChallenge({
        name,
        description,
        category,
        flag,
        points,
      });

      if (error) return res.status(500).json({ error: error.message });

      return res
        .status(201)
        .json({ success: true, result: data ? data[0] : null });
    })
    .put(async (req, res) => {
      const { id, name, description, category, flag, points } = req.body;
      const { data, error } = await upsertChallenge({
        id,
        name,
        description,
        category,
        flag,
        points,
      });

      if (error) return res.status(500).json({ error: error.message });

      return res
        .status(201)
        .json({ success: true, result: data ? data[0] : null });
    })
);
