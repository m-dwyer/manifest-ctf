import Link from "next/link";
import { FaCheck } from "react-icons/fa";

import { ChallengeWithCompletion } from "@/challenges/schemas/challenge";
import { Challenge, ChallengeAttempt } from "@prisma/client";

const ChallengeCard = ({
  challenge,
}: {
  challenge: Challenge & { challengeAttempt: ChallengeAttempt[] };
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
                {challenge.challengeAttempt[0]?.completed && (
                  <FaCheck title="completed" />
                )}
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
