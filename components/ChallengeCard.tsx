import Link from "next/link";
import { useRouter } from "next/router";
import { FaCheck } from "react-icons/fa";

import { ChallengeWithCompletion } from "types/Challenge";

const ChallengeCard = ({
  challenge,
}: {
  challenge: ChallengeWithCompletion;
}) => {
  return (
    <Link
      key={challenge.id}
      href={`/challenges/[id]`}
      as={`/challenges/${challenge.id}`}
    >
      <a>
        <div className="flex-initial card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="card-title">
              {challenge.name}
              <span className="tooltip" data-tip="Completed!">
                {challenge.challenge_attempts[0]?.completed && <FaCheck />}
              </span>
            </div>
            <p>{challenge.description}</p>
            <div>{challenge.points} points</div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ChallengeCard;
