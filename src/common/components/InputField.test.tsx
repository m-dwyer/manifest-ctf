import { InputField } from "@/common/components/InputField";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe("InputField", () => {
  it("renders", () => {
    render(
      <InputField
        name="my-field"
        label="my field"
        type="text"
        value="init value"
        onChange={() => {}}
      />
    );

    const labelledInput = screen.queryByLabelText("my field");
    expect(labelledInput).toBeInTheDocument();
    expect(labelledInput).toHaveValue("init value");
  });
});
