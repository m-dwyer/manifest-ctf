import { useState } from "react";
import { useUpsertChallenge } from "@/challenges/queries/challenges";
import { uploadFileToBucket } from "@/base/queries/storage";
import FileUpload from "@/common/components/FileUpload";
import { Form } from "@/common/components/Form";
import { InputField } from "@/common/components/InputField";
import { TextAreaField } from "@/common/components/TextAreaField";
import { SelectField } from "@/common/components/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchAllCategories } from "@/challenges/queries/categories";
import { FieldValues } from "react-hook-form";
import { challengeToUpsertSchema } from "@/challenges/schemas/challenge";
import type { ChallengeToUpsert } from "@/challenges/schemas/challenge";
import { Upload } from "@/base/dto/Upload";
import { Challenge } from "@prisma/client";

type ChallengeFormProps = {
  challenge?: Challenge;
  handleDismiss: () => void;
};

const ChallengeForm = ({ challenge, handleDismiss }: ChallengeFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>();

  const queryClient = useQueryClient();
  const upsertMutation = useUpsertChallenge();

  const fetchAllCategoriesQuery = useFetchAllCategories();

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

      const upload: Upload = {
        bucket: "challenge_files",
        filePath: filePath,
        file: f,
      };
      const { error } = await uploadFileToBucket(upload);

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
        ...(data as ChallengeToUpsert),
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
    <Form schema={challengeToUpsertSchema} submitHandler={handleSubmit}>
      <>
        <InputField
          defaultValue={challenge?.name}
          name="name"
          label="name"
          type="text"
        />
        <TextAreaField
          defaultValue={challenge?.description}
          name="description"
          label="description"
          rows={4}
          cols={60}
        />
        <SelectField
          name="categoryId"
          label="category"
          options={fetchAllCategoriesQuery.data?.map((c) => ({
            label: c.name,
            value: String(c.id),
          }))}
          defaultValue={
            fetchAllCategoriesQuery.data?.find(
              (c) => c.id === Number(challenge?.categoryId)
            )?.id || "1"
          }
        />
        <label className="file" htmlFor="challenge-files[]">
          file
        </label>
        <FileUpload files={files} setFiles={setFiles} />
        <InputField name="flag" type="text" defaultValue={challenge?.flag} />
        <InputField
          name="points"
          type="number"
          min={0}
          max={10000}
          options={{
            valueAsNumber: true,
          }}
          defaultValue={challenge?.points}
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
