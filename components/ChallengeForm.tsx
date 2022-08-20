import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMultiInputs } from "lib/hooks/useMultiInputs";
import React, { useState } from "react";
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
  const existingInputs = challenge
    ? {
        name: challenge.name,
        category: challenge?.challenge_categories[0].category.id,
        description: challenge.description,
        flag: challenge.flag,
        points: String(challenge.points),
      }
    : null;

  const [formData, setFormData] = useMultiInputs(existingInputs);

  const [files, setFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>();

  const showError = (error: string) => {
    setSubmitError(error);

    setTimeout(() => {
      setSubmitError(null);
    }, 5000);
  };

  const uploadFiles = () => {
    const { name } = formData;

    files.forEach(async (f) => {
      const filePath = `${name.replace(/\s/g, "_")}/${f.name}`;

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
        ...formData,
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
        value={formData.name}
        onChange={(e) => setFormData({ name: e.target.value })}
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
        value={formData.description}
        onChange={(e) => setFormData({ description: e.target.value })}
      />
      <label className="label" htmlFor="challenge-category">
        Category
      </label>
      <select
        className="select bg-base-200"
        value={formData.category}
        onChange={(e) => setFormData({ category: e.target.value })}
      >
        {challenge?.challenge_categories && (
          <option
            disabled
            selected
            value={challenge?.challenge_categories[0].category.id}
          >
            {challenge?.challenge_categories[0].category.name}
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
        value={formData.flag}
        onChange={(e) => setFormData({ flag: e.target.value })}
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
        value={formData.points}
        onChange={(e) => setFormData({ points: e.target.value })}
      />
      {submitError != null && <span className="mt-5">{submitError}</span>}
      <button className="btn mt-10" type="submit">
        {challenge ? "edit" : "add"}
      </button>
    </form>
  );
};

export default ChallengeForm;
