import { SelectHTMLAttributes } from "react";
import { LabelledField } from "@/common/components/LabelledField";

type SelectFieldProps = {
  name: string;
  label?: string;
  selected: { label: string; value: string };
  options: [{ label: string; value: string }];
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = ({
  name,
  label = name,
  selected,
  options,
  ...props
}: SelectFieldProps) => {
  return (
    <LabelledField name={name} label={label}>
      <select
        name={name}
        id={name}
        className="select bg-base-200"
        value={selected.value}
        {...props}
      >
        {selected && (
          <option selected key={selected.value} value={selected.value}>
            {selected.label}
          </option>
        )}
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