import React, { useState } from "react";
import Modal from "./Modal";

const AddChallengeForm = () => {
  const [challengeName, setChallengeName] = useState<string>("");
  const [challengeDescription, setChallengeDescription] = useState<string>("");
  const [challengeFlag, setChallengeFlag] = useState<string>("");

  const [challengePoints, setChallengePoints] = useState<number>(0);

  const [submitError, setSubmitError] = useState<string | null>();

  const showError = (error: string) => {
    setSubmitError(error);

    setTimeout(() => {
      setSubmitError(null);
    }, 5000);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        add
      </button>
    </form>
  );
};

export default AddChallengeForm;
