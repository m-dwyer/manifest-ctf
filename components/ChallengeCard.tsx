import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { Challenge } from "types/Challenge";

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const router = useRouter();

  return (
    <Link
      key={challenge.id}
      href={`/challenges/[id]`}
      as={`/challenges/${challenge.id}`}
    >
      <a>
        <div className="flex-initial card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="card-title">{challenge.name}</div>
            <p>{challenge.description}</p>
            <button onClick={() => router.push(`/challenges/${challenge.id}`)}>
              open
            </button>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ChallengeCard;
