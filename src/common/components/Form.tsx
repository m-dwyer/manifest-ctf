import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";

type FormProps = {
  submitHandler: SubmitHandler<FieldValues>;
  children: React.ReactNode;
};

export const Form = ({ submitHandler, children }: FormProps) => {
  const methods = useForm();

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
