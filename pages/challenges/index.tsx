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

  const currentPage: number = Number(query.page) || 1;

  const [rangeBegin, setRangeBegin] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(PAGE_LIMIT - 1);

  const [challengeCount, setChallengeCount] = useState<number>(0);

  const fetchChallenges = async () => {
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
  }, [currentPage, rangeBegin, rangeEnd]);

  return (
    <div className="flex flex-col mx-auto items-center">
      <div className="flex gap-6 flex-wrap justify-center mx-auto">
        {challenges &&
          challenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
      </div>
      <Pagination
        current={currentPage}
        setFrom={setRangeBegin}
        setTo={setRangeEnd}
        pathName="/challenges"
        total={challengeCount}
        perPage={PAGE_LIMIT}
      />
    </div>
  );
};

export default Challenges;
