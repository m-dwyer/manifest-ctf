import React, { useState } from "react";
import { Challenge } from "types/Challenge";

type ChallengeFormProps = {
  challenge?: Challenge | null;
  handleDismiss: () => void;
};

const ChallengeForm = ({ challenge, handleDismiss }: ChallengeFormProps) => {
  const [challengeId, setChallengeId] = useState<number | null>(
    challenge?.id || null
  );

  const [challengeName, setChallengeName] = useState<string>(
    challenge?.name || ""
  );
  const [challengeDescription, setChallengeDescription] = useState<string>(
    challenge?.description || ""
  );
  const [challengeFlag, setChallengeFlag] = useState<string>(
    challenge?.flag || ""
  );

  const [challengePoints, setChallengePoints] = useState<number>(
    challenge?.points || 0
  );

  const [submitError, setSubmitError] = useState<string | null>();

  const showError = (error: string) => {
    setSubmitError(error);

    setTimeout(() => {
      setSubmitError(null);
    }, 5000);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const method = challenge ? "PUT" : "POST";

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: challengeId,
        name: challengeName,
        description: challengeDescription,
        flag: challengeFlag,
        points: challengePoints,
      }),
    };

    const result = await fetch(`/api/challenges/admin`, options);
    const json = await result.json();

    if (json.error) {
      showError(json.error);
    } else {
      handleDismiss();
    }
  };

  return (
    <form className="form-control" onSubmit={(e) => handleSubmit(e)}>
      <label className="label" htmlFor="challenge-name">
        name
      </label>
      <input
        className="input bg-base-200"
        type="text"
        id="challenge-name"
        name="challenge-name"
        placeholder="My challenge"
        value={challengeName}
        onChange={(e) => setChallengeName(e.target.value)}
      />
      <label className="label" htmlFor="challenge-description">
        Description
      </label>
      <textarea
        className="input bg-base-200"
        id="challenge-description"
        name="challenge-description"
        placeholder="Describe the challenge here.."
        rows={4}
        cols={60}
        value={challengeDescription}
        onChange={(e) => setChallengeDescription(e.target.value)}
      />
      <label className="label" htmlFor="challenge-name">
        flag
      </label>
      <input
        className="input bg-base-200"
        type="text"
        id="challenge-flag"
        name="challenge-flag"
        placeholder="flag"
        value={challengeFlag}
        onChange={(e) => setChallengeFlag(e.target.value)}
      />
      <label className="label" htmlFor="challenge-points">
        Points
      </label>
      <input
        className="input bg-base-200"
        type="number"
        id="challenge-points"
        name="challenge-points"
        min={0}
        max={10000}
        value={challengePoints}
        onChange={(e) => setChallengePoints(Number(e.target.value))}
      />
      {submitError != null && <span className="mt-5">{submitError}</span>}
      <button className="btn mt-10" type="submit">
        {challenge ? "edit" : "add"}
      </button>
    </form>
  );
};

export default ChallengeForm;
