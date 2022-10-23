import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import ChallengeCard from "@/challenges/components/ChallengeCard";
import Pagination from "@/common/components/Pagination";
import { useFetchChallengesByRange } from "@/challenges/queries/challenges";

const PAGE_LIMIT = 5;

const Challenges: NextPage = () => {
  const { query } = useRouter();
  const currentPage: number = Number(query.page) || 1;

  const [rangeBegin, setRangeBegin] = useState(0);

  const fetchChallengesByRangeQuery = useFetchChallengesByRange({
    rangeBegin,
    rangeCount: PAGE_LIMIT,
  });

  if (fetchChallengesByRangeQuery.isLoading) {
    return <>Loading..</>;
  }

  console.log(
    "fetchChallengesByRangeQuery.data?: ",
    fetchChallengesByRangeQuery.data
  );

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
        {fetchChallengesByRangeQuery.data?.challenges.map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}
      </div>
      <Pagination
        current={currentPage}
        setFrom={setRangeBegin}
        pathName="/challenges"
        total={fetchChallengesByRangeQuery.data?.count || 0}
        perPage={PAGE_LIMIT}
      />
    </div>
  );
};

export default Challenges;
