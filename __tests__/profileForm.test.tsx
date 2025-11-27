import { render, screen, fireEvent } from "@testing-library/react";
import ProfileForm from "@/components/ProfileForm";
import {
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
} from "@/components/input-fields/Icons";
import { ProfileProps, SocialLink } from "@/types/global";

describe("ProfileForm Component", () => {
  const mockProfile: ProfileProps = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    description: "Software engineer passionate about testing",
    imageUrl: null,
  };

  const mockSocials: SocialLink[] = [
    { platform: "x", url: "https://x.com/johndoe", Icon: TwitterIcon },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/johndoe",
      Icon: LinkedInIcon,
    },
    { platform: "github", url: "https://github.com/johndoe", Icon: GitHubIcon },
  ];

  const mockOnProfileChange = jest.fn();
  const mockOnImageChange = jest.fn();
  const mockOnSocialChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form with all fields", () => {
    render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    expect(screen.getByText("Profile Details")).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile Picture/i)).toBeInTheDocument();
    expect(screen.getByText(/Social Links/i)).toBeInTheDocument();
  });

  it("should display correct input values from profile prop", () => {
    render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("john.doe@example.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Software engineer passionate about testing"),
    ).toBeInTheDocument();
  });

  it("should call onProfileChange when first name input changes", () => {
    render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    const firstNameInput = screen.getByPlaceholderText("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    expect(mockOnProfileChange).toHaveBeenCalledTimes(1);
  });

  it("should call onProfileChange when last name input changes", () => {
    render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    const lastNameInput = screen.getByPlaceholderText("Doe");
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });

    expect(mockOnProfileChange).toHaveBeenCalledTimes(1);
  });

  it("should call onProfileChange when email input changes", () => {
    render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    const emailInput = screen.getByPlaceholderText("john.doe@example.com");
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });

    expect(mockOnProfileChange).toHaveBeenCalledTimes(1);
  });

  it("should call onProfileChange when description textarea changes", () => {
    render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    const descriptionTextarea = screen.getByPlaceholderText(
      "Write about yourself...",
    );
    fireEvent.change(descriptionTextarea, {
      target: { value: "Updated description" },
    });

    expect(mockOnProfileChange).toHaveBeenCalledTimes(1);
  });

  it("should render ImageUpload component and handle image changes", () => {
    render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    const fileInput = screen.getByTestId("file-upload");
    const file = new File(["image content"], "profile.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnImageChange).toHaveBeenCalledTimes(1);
  });

  it("should render SocialFields component with correct socials data", () => {
    render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    expect(
      screen.getByDisplayValue("https://x.com/johndoe"),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("https://linkedin.com/in/johndoe"),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("https://github.com/johndoe"),
    ).toBeInTheDocument();
  });

  it("should handle empty profile values", () => {
    const emptyProfile: ProfileProps = {
      firstName: "",
      lastName: "",
      email: "",
      description: "",
      imageUrl: null,
    };

    render(
      <ProfileForm
        profile={emptyProfile}
        socials={mockSocials}
        onProfileChange={mockOnProfileChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />,
    );

    const firstNameInput = screen.getByPlaceholderText("John");
    expect(firstNameInput).toHaveValue("");
  });
});
