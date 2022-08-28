import {
  InputAction,
  InputState,
  useMultiInputs,
} from "@/lib/hooks/useMultiInputs";
import { Dispatch, FormEvent } from "react";

type FormProps = {
  submitHandler: (
    event: FormEvent<HTMLFormElement>,
    formData: InputState
  ) => void;
  children: (
    formData: InputState,
    setFormData: Dispatch<InputAction>
  ) => React.ReactNode;
};

export const Form = ({ submitHandler, children }: FormProps) => {
  const [formData, setFormData] = useMultiInputs({});

  return (
    <form className="form-control" onSubmit={(e) => submitHandler(e, formData)}>
      {children(formData, setFormData)}
    </form>
  );
};
