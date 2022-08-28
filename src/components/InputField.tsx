import { InputHTMLAttributes } from "react";

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
    <>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        className="input"
        type={type}
        id={name}
        name={name}
        value={value}
        {...props}
      ></input>
    </>
  );
};
