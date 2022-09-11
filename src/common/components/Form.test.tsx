import { Form } from "@/common/components/Form";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-test-renderer";

describe("Form", () => {
  it("renders", () => {
    const mockSubmitHandler = jest.fn((e) => e.preventDefault());

    render(
      <Form submitHandler={mockSubmitHandler}>
        {(formData, setFormData) => <>it renders</>}
      </Form>
    );

    expect(screen.getByText("it renders")).toBeInTheDocument();
  });

  it("submits", async () => {
    const mockSubmitHandler = jest.fn((e) => e.preventDefault());

    render(
      <Form submitHandler={mockSubmitHandler}>
        {(formData, setFormData) => (
          <>
            <button type="submit">click me</button>
          </>
        )}
      </Form>
    );

    const submitButton = screen.getByRole("button");

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
