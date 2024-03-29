import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
type FormProps = {
  schema?: z.ZodTypeAny;
  submitHandler: SubmitHandler<FieldValues>;
  children: React.ReactNode;
};

export const Form = ({ schema, submitHandler, children }: FormProps) => {
  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
  });

  return (
    <FormProvider {...methods}>
      <form
        className="form-control"
        onSubmit={methods.handleSubmit(submitHandler)}
      >
        {children}
      </form>
    </FormProvider>
  );
};
