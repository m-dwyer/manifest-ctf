import { InputHTMLAttributes } from "react";
import { LabelledField } from "@/common/components/LabelledField";
import { useFormContext } from "react-hook-form";

type InputFieldProps = {
  name: string;
  label?: string;
  type: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({
  name,
  label = name,
  type,
  ...props
}: InputFieldProps) => {
  const { register } = useFormContext();

  return (
    <LabelledField name={name} label={label}>
      <input
        className="input bg-base-200"
        type={type}
        id={name}
        {...register(name)}
        {...props}
      ></input>
    </LabelledField>
  );
};
