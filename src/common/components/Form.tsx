import {
  InputAction,
  InputState,
  useMultiInputs,
} from "@/common/hooks/useMultiInputs";
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
  existingData?: InputState;
};

export const Form = ({ existingData, submitHandler, children }: FormProps) => {
  const [formData, setFormData] = useMultiInputs(existingData || {});

  return (
    <form className="form-control" onSubmit={(e) => submitHandler(e, formData)}>
      {children(formData, setFormData)}
    </form>
  );
};
