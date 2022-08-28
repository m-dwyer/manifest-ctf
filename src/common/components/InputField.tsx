import { InputHTMLAttributes } from "react";
import { LabelledField } from "@/common/components/LabelledField";

type InputFieldProps = {
  name: string;
  label?: string;
  type: string;
  value: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({
  name,
  label = name,
  type,
  value,
  ...props
}: InputFieldProps) => {
  return (
    <LabelledField name={name} label={label}>
      <input
        className="input bg-base-200"
        type={type}
        id={name}
        name={name}
        value={value}
        {...props}
      ></input>
    </LabelledField>
  );
};
