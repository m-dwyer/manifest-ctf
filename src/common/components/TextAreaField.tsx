import { TextareaHTMLAttributes } from "react";

type TextAreaFieldProps = {
  name: string;
  label?: string;
  value: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = ({
  name,
  label = name,
  value,
  ...props
}: TextAreaFieldProps) => {
  return (
    <>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <textarea
        className="input bg-base-200"
        id={name}
        name={name}
        value={value}
        {...props}
      />
    </>
  );
};
