import { useState } from "react";
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
import { useFetchAllCategories } from "@/challenges/queries/categories";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";
type ChallengeFormProps = {
  challenge?: ChallengeWithCategories | null;
  handleDismiss: () => void;
};

const ChallengeForm = ({ challenge, handleDismiss }: ChallengeFormProps) => {
  const existingInputs = challenge
    ? {
        name: challenge.name,
        category: challenge?.category?.id,
        description: challenge.description,
        flag: challenge.flag,
        points: challenge.points,
      }
    : { category: "1" };

  const [files, setFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>();
  const [categoryOptions, setCategoryOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([{ label: "Default", value: "1" }]);

  const queryClient = useQueryClient();
  const upsertMutation = useUpsertChallenge();

  const fetchAllCategoriesQuery = useFetchAllCategories();
  useEffect(() => {
    if (fetchAllCategoriesQuery.data?.data) {
      setCategoryOptions(
        fetchAllCategoriesQuery.data.data.map((c) => ({
          label: c.name,
          value: String(c.id),
        }))
      );
    }
  }, []);

  const showError = (error: string) => {
    setSubmitError(error);

    setTimeout(() => {
      setSubmitError(null);
    }, 5000);
  };

  const uploadFiles = (data: FieldValues) => {
    const { name } = data;

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

  const handleSubmit = async (data: FieldValues) => {
    uploadFiles(data);

    upsertMutation.mutate(
      {
        id: challenge?.id,
        ...(data as Challenge),
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
    <Form submitHandler={handleSubmit}>
      <>
        <InputField
          defaultValue={existingInputs.name}
          name="name"
          label="name"
          type="text"
        />
        <TextAreaField
          defaultValue={existingInputs.description}
          className="input bg-base-200"
          name="description"
          label="description"
          rows={4}
          cols={60}
        />
        <SelectField
          name="category"
          options={categoryOptions}
          defaultValue={1}
        />
        <label className="file" htmlFor="challenge-files[]">
          file
        </label>
        <FileUpload files={files} setFiles={setFiles} />
        <InputField
          name="flag"
          type="text"
          defaultValue={existingInputs.flag}
        />
        <InputField
          name="points"
          type="number"
          min={0}
          max={10000}
          defaultValue={existingInputs.points}
        />
        {submitError != null && <span className="mt-5">{submitError}</span>}
        <button className="btn mt-10" type="submit">
          {challenge ? "edit" : "add"}
        </button>
      </>
    </Form>
  );
};

export default ChallengeForm;
