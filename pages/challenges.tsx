import { useEffect, useState } from "react";

import { Challenge, ChallengeCompleted } from "types/Challenge";
import ChallengeCard from "components/ChallengeCard";

import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import type { NextPage } from "next";

const Challenges: NextPage = () => {
  const [challenges, setChallenges] = useState<ChallengeCompleted[] | null>(
    null
  );

  const fetchChallenges = async () => {
    const { data: challenges } = await supabaseClient
      .from<ChallengeCompleted>("challenges")
      .select(
        `
          *,
          challenge_attempts(
            completed
          )
        `
      )
      .order("id", { ascending: true });

    console.log("chall completed; ", challenges);

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
