type LabelledFieldProps = {
  label: string;
  name: string;
  children: React.ReactNode;
};

export const LabelledField = ({
  label,
  name,
  children,
}: LabelledFieldProps) => {
  return (
    <>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {children}
    </>
  );
};
