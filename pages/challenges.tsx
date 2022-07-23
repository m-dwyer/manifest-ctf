import { useEffect, useState } from "react";

import { Challenge } from "types/Challenge";
import ChallengeCard from "components/ChallengeCard";

import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import type { NextPage } from "next";

const Challenges: NextPage = () => {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);

  const fetchChallenges = async () => {
    const { data: challenges } = await supabaseClient
      .from<Challenge>("challenges")
      .select("*")
      .order("id", { ascending: true });

    setChallenges(challenges);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <>
      <div className="flex gap-6">
        {challenges &&
          challenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
      </div>
    </>
  );
};

export default Challenges;
