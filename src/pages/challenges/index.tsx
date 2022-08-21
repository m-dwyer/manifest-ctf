import { useEffect, useState } from "react";

import { ChallengeWithCompletion } from "types/Challenge";
import ChallengeCard from "components/ChallengeCard";

import type { NextPage } from "next";
import { useRouter } from "next/router";
import Pagination from "components/Pagination";
import { fetchChallengesByRange } from "services/challenges";

const PAGE_LIMIT = 5;

const Challenges: NextPage = () => {
  const { query } = useRouter();
  const [challenges, setChallenges] = useState<
    ChallengeWithCompletion[] | null
  >(null);

  const currentPage: number = Number(query.page) || 1;

  const [rangeBegin, setRangeBegin] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(PAGE_LIMIT - 1);

  const [challengeCount, setChallengeCount] = useState<number>(0);

  const fetchChallenges = async () => {
    const { challenges, count } = await fetchChallengesByRange(
      rangeBegin,
      rangeEnd
    );

    setChallengeCount(count || 0);
    setChallenges(challenges);
  };

  useEffect(() => {
    fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rangeBegin, rangeEnd]);

  return (
    <div className="flex flex-col mx-auto items-center">
      <div className="container bg-base-200 w-100 p-2">
        <select className="select max-w-ws" value={1}>
          <option disabled selected value={1}>
            Default
          </option>
        </select>
      </div>
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
