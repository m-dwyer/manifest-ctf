type LabelledFieldProps = {
  label: string;
  name: string;
  hidden?: boolean;
  children: React.ReactNode;
};

export const LabelledField = ({
  label,
  name,
  hidden,
  children,
}: LabelledFieldProps) => {
  return (
    <>
      {!hidden && (
        <label className="label" htmlFor={name}>
          {label}
        </label>
      )}
      {children}
    </>
  );
};
