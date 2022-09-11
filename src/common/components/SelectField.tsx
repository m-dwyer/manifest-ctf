import { SelectHTMLAttributes } from "react";
import { LabelledField } from "@/common/components/LabelledField";

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
  return (
    <LabelledField name={name} label={label}>
      <select name={name} id={name} className="select bg-base-200" {...props}>
        {options.map((o) => {
          return (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </select>
    </LabelledField>
  );
};
