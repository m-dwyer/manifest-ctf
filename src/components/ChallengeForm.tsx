import { useState } from "react";

import { useMultiInputs } from "@lib/hooks/useMultiInputs";
import { createChallenge, updateChallenge } from "@services/challenges";
import { uploadFileToBucket } from "@services/storage";
import { Challenge, ChallengeWithCategories } from "@type/Challenge";
import FileUpload from "@components/FileUpload";

type ChallengeFormProps = {
  challenge?: ChallengeWithCategories | null;
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
        category_id: challenge?.category?.id,
        description: challenge.description,
        flag: challenge.flag,
        points: challenge.points,
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

      const { error } = await uploadFileToBucket(
        "challenge_files",
        filePath,
        f
      );

      if (error) {
        showError(error.message);
      }
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    uploadFiles();

    const json = (await challenge?.id)
      ? await createChallenge(formData)
      : await updateChallenge(formData);

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
        value={formData.category_id}
        onChange={(e) => setFormData({ category: e.target.value })}
      >
        {challenge?.category && (
          <option disabled selected value={challenge.category.id}>
            {challenge.category.name}
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
