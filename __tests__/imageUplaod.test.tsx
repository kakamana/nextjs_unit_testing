import { render, screen, fireEvent } from "@testing-library/react";
import { ImageUpload } from "@/components/input-fields/ImageUpload";
describe("ImageUpload", () => {
  const mockHandleChange = jest.fn();

  beforeEach(() => {
    mockHandleChange.mockClear();
  });

  it("calls handleChange with the correct file when a file is selected", () => {
    render(<ImageUpload handleChange={mockHandleChange} />);

    const file = new File(["dummy content"], "profile.png", {
      type: "image/png",
    });
    const fileInput = screen.getByTestId("file-upload");
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([file]),
        }),
      }),
    );
  });

  it("calls handleChange when a single valid file is dropped", () => {
    render(<ImageUpload handleChange={mockHandleChange} />);

    const file = new File(["dummy content"], "profile.jpg", {
      type: "image/jpeg",
    });
    const dataTransfer = { files: [file] };
    const dropZone = screen.getByTestId("drop-zone");
    if (dropZone) {
      fireEvent.drop(dropZone, { dataTransfer });
    }

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });

  it("does not call handleChange when a single non-image file is dropped", () => {
    render(<ImageUpload handleChange={mockHandleChange} />);

    const nonImageFile = new File(["dummy content"], "document.pdf", {
      type: "application/pdf",
    });
    const dataTransfer = { files: [nonImageFile] };
    const dropZone = screen.getByTestId("drop-zone");

    if (dropZone) {
      fireEvent.drop(dropZone, { dataTransfer });
    }

    // The handleChange prop should NOT have been called.
    expect(mockHandleChange).not.toHaveBeenCalled();
  });

  it("clears the error message after a successful file selection", () => {
    render(<ImageUpload handleChange={mockHandleChange} />);

    // Step 1: Trigger an error by dropping multiple files.
    const file1 = new File(["file1 content"], "file1.png", {
      type: "image/png",
    });
    const file2 = new File(["file2 content"], "file2.jpg", {
      type: "image/jpeg",
    });
    const dataTransfer = { files: [file1, file2] };
    const dropZone = screen.getByTestId("drop-zone");
    if (dropZone) {
      fireEvent.drop(dropZone, { dataTransfer });
    }

    // Expect the error message to be in the document.
    expect(
      screen.getByText(/Only one image can be uploaded./i),
    ).toBeInTheDocument();

    // Step 2: Select a single valid file to clear the error.
    const fileInput = screen.getByTestId("file-upload");
    const validFile = new File(["single file"], "single.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Expect the error message to be gone and handleChange to be called.
    expect(
      screen.queryByText(/Only one image can be uploaded./i),
    ).not.toBeInTheDocument();
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });
});