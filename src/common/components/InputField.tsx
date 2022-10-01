import { InputHTMLAttributes } from "react";
import { LabelledField } from "@/common/components/LabelledField";
import { RegisterOptions, useFormContext } from "react-hook-form";

type InputFieldProps = {
  name: string;
  label?: string;
  type: string;
  hidden?: boolean;
  options?: RegisterOptions;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({
  name,
  label = name,
  type,
  hidden,
  options,
  ...props
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<any>();

  return (
    <LabelledField hidden={hidden} name={name} label={label}>
      <>
        <input
          className={`input input-primary bg-base-200 ${
            errors[name] ? "input-error" : ""
          } `}
          type={type}
          id={name}
          {...register(name, options)}
          {...props}
        ></input>
        {errors[name] && <span>{errors[name]?.message as string}</span>}
      </>
    </LabelledField>
  );
};
