import { TextareaHTMLAttributes } from "react";
import { LabelledField } from "@/common/components/LabelledField";
import { useFormContext } from "react-hook-form";

type TextAreaFieldProps = {
  name: string;
  label?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = ({
  name,
  label = name,
  ...props
}: TextAreaFieldProps) => {
  const { register } = useFormContext();

  return (
    <LabelledField name={name} label={label}>
      <textarea
        className="textarea textarea-primary bg-base-200"
        id={name}
        {...register(name)}
        {...props}
      />
    </LabelledField>
  );
};
