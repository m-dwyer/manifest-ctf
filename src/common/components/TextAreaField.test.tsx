import { TextAreaField } from "@/common/components/TextAreaField";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe("TextAreaField", () => {
  it("renders", () => {
    render(
      <TextAreaField
        name="my-text-area"
        label="text area"
        value="existing value"
        onChange={() => {}}
      />
    );

    const textAreaInput = screen.getByLabelText("text area");
    expect(textAreaInput).toHaveValue("existing value");
  });
});
