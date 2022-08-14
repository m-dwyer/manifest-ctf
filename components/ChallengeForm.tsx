import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import React, { useState } from "react";
import { Category } from "types/Category";
import { Challenge } from "types/Challenge";
import FileUpload from "./FileUpload";

type ChallengeFormProps = {
  challenge?: Challenge | null;
  handleDismiss: () => void;
  handleSave: (c: Challenge) => void;
};

const ChallengeForm = ({
  challenge,
  handleDismiss,
  handleSave,
}: ChallengeFormProps) => {
  const [challengeName, setChallengeName] = useState<string>(
    challenge?.name || ""
  );
  const [challengeDescription, setChallengeDescription] = useState<string>(
    challenge?.description || ""
  );
  const [challengeCategory, setChallengeCategory] = useState<Category | null>(
    challenge?.challenge_categories?.[0].category || null
  );
  const [challengeFlag, setChallengeFlag] = useState<string>(
    challenge?.flag || ""
  );
  const [challengePoints, setChallengePoints] = useState<number>(
    challenge?.points || 0
  );
  const [files, setFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>();

  const showError = (error: string) => {
    setSubmitError(error);

    setTimeout(() => {
      setSubmitError(null);
    }, 5000);
  };

  const uploadFiles = () => {
    files.forEach(async (f) => {
      const filePath = `${challengeName.replace(/\s/g, "_")}/${f.name}`;

      const { error } = await supabaseClient.storage
        .from("challenge_files")
        .upload(filePath, f);

      if (error) {
        showError(error.message);
      }
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const method = challenge ? "PUT" : "POST";

    uploadFiles();

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: challengeName,
        description: challengeDescription,
        category: challengeCategory?.id,
        flag: challengeFlag,
        points: challengePoints,
      }),
    };

    const result = await fetch(`/api/challenges/admin`, options);
    const json = await result.json();

    if (json.error) {
      showError(json.error);
    } else {
      handleSave(json.result as Challenge);
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
      <label className="label" htmlFor="challenge-category">
        Category
      </label>
      <select className="select bg-base-200">
        {challengeCategory && (
          <option disabled selected value={challengeCategory.id}>
            {challengeCategory.name}
          </option>
        )}
      </select>
      <label className="file" htmlFor="challenge-file">
        File
      </label>
      <FileUpload files={[files, setFiles]} />
      <label className="label" htmlFor="challenge-name">
        Flag
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
