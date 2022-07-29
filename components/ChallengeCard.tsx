import Link from "next/link";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { ChallengeCompleted } from "types/Challenge";

const ChallengeCard = ({ challenge }: { challenge: ChallengeCompleted }) => {
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
            <div className="card-title">
              {challenge.name}
              <span className="tooltip" data-tip="Completed!">
                {challenge.challenge_attempts[0]?.completed && (
                  <FontAwesomeIcon icon={faCheck} />
                )}
              </span>
            </div>
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
