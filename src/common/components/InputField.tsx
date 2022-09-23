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
  const {
    register,
    formState: { errors },
  } = useFormContext<any>();

  return (
    <LabelledField name={name} label={label}>
      <>
        <input
          className={`input input-primary bg-base-200 ${
            errors[name] ? "input-error" : ""
          } `}
          type={type}
          id={name}
          {...register(name)}
          {...props}
        ></input>
        {errors[name] && <span>{errors[name]?.message as string}</span>}
      </>
    </LabelledField>
  );
};
