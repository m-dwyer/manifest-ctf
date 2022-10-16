import { InputField } from "@/common/components/InputField";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { FormProvider, useForm } from "react-hook-form";

describe("InputField", () => {
  it("renders", () => {
    const Wrapper = ({ ...props }) => {
      const formMethods = useForm();
      return <FormProvider {...formMethods}>{props.children}</FormProvider>;
    };

    render(
      <Wrapper>
        <InputField
          name="my-field"
          label="my field"
          type="text"
          value="init value"
          onChange={() => {}}
        />
      </Wrapper>
    );

    const labelledInput = screen.queryByLabelText("my field");
    expect(labelledInput).toBeInTheDocument();
    expect(labelledInput).toHaveValue("init value");
  });
});
