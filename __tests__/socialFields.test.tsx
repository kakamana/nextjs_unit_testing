import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SocialFields } from "@/components/input-fields/SocialFields";
import {
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
} from "@/components/input-fields/Icons";
import { SocialLink } from "@/types/global";

const TestWrapper = ({ initialSocials }: { initialSocials: SocialLink[] }) => {
  const [socials, setSocials] = useState(initialSocials);

  const onSocialChange = (index: number, value: string) => {
    setSocials((prevSocials) =>
      prevSocials.map((social, i) =>
        i === index ? { ...social, url: value } : social,
      ),
    );
  };

  return <SocialFields socials={socials} onChange={onSocialChange} />;
};

describe("SocialFields Validation", () => {
  const user = userEvent.setup();

  const mockSocials = [
    { platform: "x", url: "", Icon: TwitterIcon },
    { platform: "linkedin", url: "", Icon: LinkedInIcon },
    { platform: "github", url: "", Icon: GitHubIcon },
  ];

  it("should show an error message for an invalid URL immediately", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const linkedInInput = screen.getByPlaceholderText(
      /linkedin\.com\/username/i,
    );

    await user.type(linkedInInput, "github.com/invalid");

    expect(
      screen.getByText(/Please enter a valid linkedin URL/i),
    ).toBeInTheDocument();
  });

  it("should show error message for invalid domain on any platform", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const githubInput = screen.getByPlaceholderText(/github\.com\/username/i);

    await user.type(githubInput, "twitter.com/invalid");

    // Error appears immediately due to onChange validation
    expect(
      screen.getByText(/Please enter a valid github URL/i),
    ).toBeInTheDocument();
  });

  it("should clear error when valid URL is entered", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const xInput = screen.getByPlaceholderText(/x\.com\/username/i);

    // Enter invalid URL
    await user.type(xInput, "invalid.com/wrong");
    expect(screen.getByText(/Please enter a valid x URL/i)).toBeInTheDocument();

    // Enter valid URL
    await user.clear(xInput);
    await user.type(xInput, "x.com/validuser");

    expect(
      screen.queryByText(/Please enter a valid x URL/i),
    ).not.toBeInTheDocument();
  });

  it("should not show error for empty input", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const githubInput = screen.getByPlaceholderText(/github\.com\/username/i);

    await user.type(githubInput, "some text");
    await user.clear(githubInput);

    expect(
      screen.queryByText(/Please enter a valid github URL/i),
    ).not.toBeInTheDocument();
  });

  it("should validate URL on blur event", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const linkedInInput = screen.getByPlaceholderText(
      /linkedin\.com\/username/i,
    );

    await user.type(linkedInInput, "github.com/invalid");
    await user.tab(); // Trigger blur

    expect(
      screen.getByText(/Please enter a valid linkedin URL/i),
    ).toBeInTheDocument();
  });

  it("should not show error on blur when input is empty", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const xInput = screen.getByPlaceholderText(/x\.com\/username/i);

    await user.click(xInput);
    await user.tab(); // Trigger blur on empty field

    expect(
      screen.queryByText(/Please enter a valid x URL/i),
    ).not.toBeInTheDocument();
  });

  it("should accept twitter.com domain for X platform", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const xInput = screen.getByPlaceholderText(/x\.com\/username/i);

    await user.type(xInput, "twitter.com/validuser");

    expect(
      screen.queryByText(/Please enter a valid x URL/i),
    ).not.toBeInTheDocument();
  });

  it("should accept URL without protocol", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const githubInput = screen.getByPlaceholderText(/github\.com\/username/i);

    await user.type(githubInput, "github.com/validuser");

    expect(
      screen.queryByText(/Please enter a valid github URL/i),
    ).not.toBeInTheDocument();
  });

  it("should accept URL with https protocol", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const linkedInInput = screen.getByPlaceholderText(
      /linkedin\.com\/username/i,
    );

    await user.type(linkedInInput, "https://linkedin.com/in/validuser");

    expect(
      screen.queryByText(/Please enter a valid linkedin URL/i),
    ).not.toBeInTheDocument();
  });

  it("should accept URL with www prefix", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const githubInput = screen.getByPlaceholderText(/github\.com\/username/i);

    await user.type(githubInput, "www.github.com/validuser");

    expect(
      screen.queryByText(/Please enter a valid github URL/i),
    ).not.toBeInTheDocument();
  });

  it("should persist error after blur if URL is invalid", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const xInput = screen.getByPlaceholderText(/x\.com\/username/i);

    // Type invalid URL
    await user.type(xInput, "invalid.com/user");

    // Blur the input
    await user.tab();

    // Error should still be visible after blur
    expect(screen.getByText(/Please enter a valid x URL/i)).toBeInTheDocument();
  });

  it("should handle trimming of whitespace in validation", async () => {
    render(<TestWrapper initialSocials={mockSocials} />);

    const githubInput = screen.getByPlaceholderText(/github\.com\/username/i);

    // Type URL with spaces
    await user.type(githubInput, "   ");

    // Should not show error for whitespace-only input
    expect(
      screen.queryByText(/Please enter a valid github URL/i),
    ).not.toBeInTheDocument();
  });
});