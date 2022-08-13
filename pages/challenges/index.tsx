import { useEffect, useState } from "react";

import { ChallengeCompleted } from "types/Challenge";
import ChallengeCard from "components/ChallengeCard";

import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import type { NextPage } from "next";
import { useRouter } from "next/router";
import Pagination from "components/Pagination";

const PAGE_LIMIT = 5;

const Challenges: NextPage = () => {
  const { query } = useRouter();
  const [challenges, setChallenges] = useState<ChallengeCompleted[] | null>(
    null
  );

  const page: number = Number(query.page) || 1;

  const [challengeCount, setChallengeCount] = useState<number>(0);

  const fetchChallenges = async () => {
    const rangeBegin = (page - 1) * PAGE_LIMIT;
    const rangeEnd = rangeBegin + (PAGE_LIMIT - 1);

    const { data: challenges, count } = await supabaseClient
      .from<ChallengeCompleted>("challenges")
      .select(
        `
          *,
          challenge_attempts(
            completed
          )
        `,
        { count: "exact" }
      )
      .order("id", { ascending: true })
      .range(rangeBegin, rangeEnd);

    setChallengeCount(count || 0);

    setChallenges(challenges);
  };

  useEffect(() => {
    fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const pageCount = Math.ceil(challengeCount / PAGE_LIMIT);

  return (
    <div className="flex flex-col mx-auto items-center">
      <div className="flex gap-6 flex-wrap justify-center mx-auto">
        {challenges &&
          challenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
      </div>
      <Pagination
        current={page}
        pathName="/challenges"
        total={pageCount}
        className="mt-10"
      />
    </div>
  );
};

export default Challenges;
