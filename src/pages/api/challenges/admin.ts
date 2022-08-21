import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServiceClient } from "lib/supabaseServiceClient";
import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import nc from "next-connect";
import { Challenge } from "types/Challenge";

type ChallengeUpsertProps = {
  name: string;
  description: string;
  category: number;
  flag: string;
  points: number;
};

const upsertChallenge = async ({
  name,
  description,
  category,
  flag,
  points,
}: ChallengeUpsertProps) => {
  const { data: challengeData, error: challengeError } =
    await supabaseServiceClient
      .from("challenges")
      .upsert([{ name, description, flag, points }], { onConflict: "name" })
      .select(`
        id,
        name,
        description,
        flag,
        points,
        category(id, name)
      `);

  if (challengeError) {
    return { error: challengeError };
  }

  const upsertedChallenge = challengeData[0] as Challenge;

  const { data: categoryData, error: categoryError } =
    await supabaseServiceClient
      .from("challenge_categories")
      .upsert([{ challenge: upsertedChallenge.id, category: category }]);

  return { data: challengeData, error: challengeError };
};

export default withApiAuth(
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: err.message });
    },
  })
    .get(async (req, res) => {
      const { data: challengeData, error } = await supabaseServiceClient
        .from("challenges")
        .select(
          `
        *,
        category(id, name)
          `
        )
        .order("id", { ascending: true });

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ data: challengeData });
    })
    .delete(async (req, res) => {
      const { challenge } = req.body;
      const { data, error } = await supabaseServiceClient
        .from("challenges")
        .delete()
        .match({ id: challenge });

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
);
