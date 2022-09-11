import { SelectField } from "@/common/components/SelectField";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe("SelectField", () => {
  it("renders", () => {
    const options = [
      { label: "First", value: "1" },
      { label: "Second", value: "2" },
      { label: "Third", value: "3" },
    ];

    render(<SelectField name="category" options={options} />);

    const selectOptions = screen.getAllByTestId("select-option");

    expect(selectOptions.length).toBe(3);
    expect(selectOptions[0]).toHaveValue("1");
    expect(selectOptions[1]).toHaveValue("2");
    expect(selectOptions[2]).toHaveValue("3");
  });
});
