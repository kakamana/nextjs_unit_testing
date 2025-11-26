import { render, screen, fireEvent } from "@testing-library/react";
import { InputField } from "@/components/input-fields/InputField";

describe("InputField", () => {
  const label = "First Name";
  const name = "firstName";
  const placeholder = "John";

  it("renders correctly with label and placeholder", () => {
    render(
      <InputField
        label={label}
        name={name}
        value=""
        onChange={() => {}}
        placeholder={placeholder}
        required
      />,
    );

    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();

    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(
      <InputField label={label} name={name} value="" onChange={handleChange} />,
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Jane" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("shows error if required and blurred with empty value", () => {
    render(
      <InputField
        label={label}
        name={name}
        value=""
        onChange={() => {}}
        required
      />,
    );

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    const errorMessage = screen.getByText(`${label} is required.`);
    expect(errorMessage).toBeInTheDocument();
  });

  it("does not show error if required and value is present", () => {
    render(
      <InputField
        label={label}
        name={name}
        value="John"
        onChange={() => {}}
        required
      />,
    );

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    const errorMessage = screen.queryByText(`${label} is required.`);
    expect(errorMessage).not.toBeInTheDocument();
  });
});