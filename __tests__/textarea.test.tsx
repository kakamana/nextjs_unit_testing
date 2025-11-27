import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextArea } from "@/components/input-fields/TextArea";

const TestWrapper = ({
  initialValue,
  maxWords,
}: {
  initialValue: string;
  maxWords?: number;
}) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  return (
    <TextArea
      label="Description"
      name="description"
      value={value}
      onChange={handleChange}
      maxWords={maxWords}
    />
  );
};

describe("TextArea Component", () => {
  it("updates value and does not show error when typing within word limit", async () => {
    const user = userEvent.setup();
    render(<TestWrapper initialValue="" maxWords={3} />);

    const textarea = screen.getByRole("textbox");

    await user.type(textarea, "I'm full-stack developer");

    expect(textarea).toHaveValue("I'm full-stack developer");
    expect(
      screen.queryByText(/Maximum 3 words allowed/),
    ).not.toBeInTheDocument();
  });

  it("clears the error message when the word count becomes valid", async () => {
    const user = userEvent.setup();
    render(<TestWrapper initialValue="This is a" maxWords={3} />);

    const textarea = screen.getByRole("textbox");

    // Step 1: Type text that exceeds the limit
    await user.type(textarea, "This is too long");

    // Expect the error to appear
    const errorElement = await screen.findByText("Maximum 3 words allowed");
    expect(errorElement).toBeInTheDocument();

    // Step 2: Now, change the value to be within the limit
    await user.clear(textarea);
    await user.type(textarea, "This is a");

    // Expect the error to be gone
    expect(
      screen.queryByText("Maximum 3 words allowed"),
    ).not.toBeInTheDocument();
  });

  it("handles empty input correctly", async () => {
    render(<TestWrapper initialValue="" maxWords={3} />);

    const textarea = screen.getByRole("textbox");

    await userEvent.type(textarea, "   "); // Whitespace only
    fireEvent.blur(textarea);

    expect(
      screen.queryByText("Maximum 3 words allowed"),
    ).not.toBeInTheDocument();
  });
});