import { TextAreaField } from "@/common/components/TextAreaField";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { FormProvider, useForm } from "react-hook-form";

describe("TextAreaField", () => {
  it("renders", () => {
    const Wrapper = ({ ...props }) => {
      const formMethods = useForm();
      return <FormProvider {...formMethods}>{props.children}</FormProvider>;
    };

    render(
      <Wrapper>
        <TextAreaField
          name="my-text-area"
          label="text area"
          value="existing value"
          onChange={() => {}}
        />
      </Wrapper>
    );

    const textAreaInput = screen.getByLabelText("text area");
    expect(textAreaInput).toHaveValue("existing value");
  });
});
