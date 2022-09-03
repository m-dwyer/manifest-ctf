import { useState } from "react";

import { InputState, useMultiInputs } from "@/common/hooks/useMultiInputs";
import { useUpsertChallenge } from "@/challenges/queries/challenges";
import { uploadFileToBucket } from "@/base/queries/storage";
import {
  Challenge,
  ChallengeWithCategories,
} from "@/challenges/types/Challenge";
import FileUpload from "@/common/components/FileUpload";
import { Form } from "@/common/components/Form";
import { InputField } from "@/common/components/InputField";
import { TextAreaField } from "@/common/components/TextAreaField";
import { SelectField } from "@/common/components/SelectField";
import { useQueryClient } from "@tanstack/react-query";
type ChallengeFormProps = {
  challenge?: ChallengeWithCategories | null;
  handleDismiss: () => void;
};

const ChallengeForm = ({ challenge, handleDismiss }: ChallengeFormProps) => {
  const existingInputs = challenge
    ? {
        name: challenge.name,
        category_id: challenge?.category?.id,
        category_name: challenge?.category?.name,
        description: challenge.description,
        flag: challenge.flag,
        points: challenge.points,
      }
    : null;

  const [formData, setFormData] = useMultiInputs(existingInputs);

  const [files, setFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>();

  const queryClient = useQueryClient();
  const upsertMutation = useUpsertChallenge();

  const showError = (error: string) => {
    setSubmitError(error);

    setTimeout(() => {
      setSubmitError(null);
    }, 5000);
  };

  const uploadFiles = (formData: InputState) => {
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

    uploadFiles(formData);

    upsertMutation.mutate(
      {
        id: challenge?.id,
        ...(formData as Challenge),
      },
      {
        onError: (error) => {
          if (error instanceof Error) {
            showError(error.message);
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries(["challengesForAdmin"]);
          handleDismiss();
        },
      }
    );
  };

  return (
    <Form existingData={formData} submitHandler={handleSubmit}>
      {(formData, setFormData) => (
        <>
          <InputField
            name="challenge-name"
            label="name"
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ name: e.target.value });
            }}
          />
          <TextAreaField
            className="input bg-base-200"
            name="description"
            label="description"
            rows={4}
            cols={60}
            value={formData.description}
            onChange={(e) => setFormData({ description: e.target.value })}
          />
          <SelectField
            name="category"
            selected={{
              label: formData.category_name,
              value: formData.category_id,
            }}
            options={[{ label: "Default", value: "1" }]}
            onChange={(e) => setFormData({ category: e.target.value })}
          />
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
            name="points"
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
