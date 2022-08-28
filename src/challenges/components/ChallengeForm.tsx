import { useState } from "react";

import { InputState, useMultiInputs } from "@/common/hooks/useMultiInputs";
import {
  createChallenge,
  updateChallenge,
} from "@/challenges/services/challenges";
import { uploadFileToBucket } from "@/base/services/storage";
import {
  Challenge,
  ChallengeWithCategories,
} from "@/challenges/types/Challenge";
import FileUpload from "@/common/components/FileUpload";
import { Form } from "@/common/components/Form";
import { InputField } from "@/common/components/InputField";
type ChallengeFormProps = {
  challenge?: ChallengeWithCategories | null;
  handleDismiss: () => void;
  handleSave: (c: ChallengeWithCategories) => void;
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

  const handleSubmit = async (
    e: React.SyntheticEvent,
    formData: InputState
  ) => {
    e.preventDefault();

    uploadFiles();

    const json = challenge?.id
      ? await updateChallenge({ id: challenge.id, ...(formData as Challenge) })
      : await createChallenge(formData as Challenge);

    if (json.error) {
      showError(json.error);
    } else {
      handleSave(json.result as ChallengeWithCategories);
      handleDismiss();
    }
  };

  return (
    <Form existingData={formData} submitHandler={handleSubmit}>
      {(formData, setFormData) => (
        <>
          <InputField
            name="challenge-name"
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ name: e.target.value });
            }}
          />
          <textarea
            className="input bg-base-200"
            id="challenge-description"
            name="challenge-description"
            rows={4}
            cols={60}
            value={formData.description}
            onChange={(e) => setFormData({ description: e.target.value })}
          />
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
          <InputField
            name="flag"
            type="text"
            value={formData.flag}
            onChange={(e) => {
              setFormData({ flag: e.target.value });
            }}
          />
          <InputField
            name="challenge-points"
            type="number"
            min={0}
            max={10000}
            value={formData.points}
            onChange={(e) => setFormData({ points: e.target.value })}
          />
          {submitError != null && <span className="mt-5">{submitError}</span>}
          <button className="btn mt-10" type="submit">
            {challenge ? "edit" : "add"}
          </button>
        </>
      )}
    </Form>
  );
};

export default ChallengeForm;
