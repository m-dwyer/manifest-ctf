import FileUpload from "@/common/components/FileUpload";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-test-renderer";

/**
 * @group unit
 * @group components
 */
describe("FileUpload", () => {
  it("renders", () => {
    const mockExistingFiles: File[] = [
      new File(["some file"], "hidden_contents.txt", { type: "text/plain" }),
    ];
    const mockSetFiles = jest.fn();

    render(<FileUpload files={mockExistingFiles} setFiles={mockSetFiles} />);

    const uploadButton = screen.queryByRole("button");
    const fileItems = screen.getAllByRole("listitem");

    expect(uploadButton).toBeInTheDocument();
    expect(fileItems[0]).toHaveTextContent("hidden_contents.txt");
  });

  it("uploads a file", async () => {
    const mockExistingFiles: File[] = [];
    const mockSetFiles = jest.fn();
    const mockFile = new File(["some file"], "some_file.png", {
      type: "image/png",
    });

    render(<FileUpload files={mockExistingFiles} setFiles={mockSetFiles} />);

    const fileInput = screen.getByTestId("file-uploader") as HTMLInputElement;

    act(() => {
      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });
    });

    await waitFor(() => {
      expect(fileInput.files?.[0].name).toBe("some_file.png");
      expect(fileInput.files?.[0].type).toBe("image/png");
    });
  });

  it("deletes a file", async () => {
    const mockExistingFiles: File[] = [
      new File(["some file"], "hidden_contents.txt", { type: "text/plain" }),
    ];
    const mockSetFiles = jest.fn();

    render(<FileUpload files={mockExistingFiles} setFiles={mockSetFiles} />);

    const existingFile = screen.getByRole("listitem");
    const existingFileButton = screen.getByText("x");

    act(() => {
      expect(existingFile).toBeInTheDocument();
      expect(existingFileButton).toBeInTheDocument();

      fireEvent.click(existingFileButton);
    });

    await waitFor(() => {
      expect(mockSetFiles).toBeCalledTimes(1);
    });
  });
});
