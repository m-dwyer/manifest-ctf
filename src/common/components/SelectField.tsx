import { SelectHTMLAttributes } from "react";
import { LabelledField } from "@/common/components/LabelledField";
import { useFormContext } from "react-hook-form";

type SelectFieldProps = {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = ({
  name,
  label = name,
  options,
  ...props
}: SelectFieldProps) => {
  const { register } = useFormContext();

  return (
    <LabelledField name={name} label={label}>
      <select
        className="select select-primary bg-base-200"
        id={name}
        {...register(name)}
        {...props}
      >
        {options.map((o) => {
          return (
            <option data-testid="select-option" key={o.value} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </select>
    </LabelledField>
  );
};
