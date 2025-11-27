import { render, screen } from "@testing-library/react";
import ProfilePreview from "@/components/ProfilePreview";
import {
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
} from "@/components/input-fields/Icons";

describe("ProfilePreview Component", () => {
  const mockProfile = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    description: "Software developer with a passion for open-source.",
    imageUrl: "/test/sample-image.webp",
  };

  const mockSocials = [
    { platform: "x", url: "https://x.com/janedoe", Icon: TwitterIcon },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/janedoe",
      Icon: LinkedInIcon,
    },
    { platform: "github", url: "https://github.com/janedoe", Icon: GitHubIcon },
  ];

  it("should render correctly and match snapshot", () => {
    const { asFragment } = render(
      <ProfilePreview profile={mockProfile} socials={mockSocials} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("should not render email section when email is empty", () => {
    const profileWithoutEmail = {
      ...mockProfile,
      email: "",
    };

    render(
      <ProfilePreview profile={profileWithoutEmail} socials={mockSocials} />,
    );

    // Email link should not be in the document
    expect(screen.queryByText("jane.doe@example.com")).not.toBeInTheDocument();
  });

  it("should render placeholder text when firstName and lastName are empty", () => {
    const emptyProfile = {
      firstName: "",
      lastName: "",
      email: "",
      description: "",
      imageUrl: null,
    };

    render(<ProfilePreview profile={emptyProfile} socials={mockSocials} />);

    expect(screen.getByText("Your Name")).toBeInTheDocument();
  });

  it("should render default description when description is empty", () => {
    const profileWithoutDescription = {
      ...mockProfile,
      description: "",
    };

    render(
      <ProfilePreview
        profile={profileWithoutDescription}
        socials={mockSocials}
      />,
    );

    expect(
      screen.getByText(
        /A short and catchy description about yourself will appear here/i,
      ),
    ).toBeInTheDocument();
  });

  it("should render default user icon when imageUrl is not provided", () => {
    const profileWithoutImage = {
      ...mockProfile,
      imageUrl: null,
    };

    render(
      <ProfilePreview profile={profileWithoutImage} socials={mockSocials} />,
    );

    const userIcon = document.querySelector(".lucide-user");
    expect(userIcon).toBeInTheDocument();
  });

  it("should render social links only when url is provided", () => {
    const socialsWithEmptyUrl = [
      { platform: "x", url: "", Icon: TwitterIcon },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/janedoe",
        Icon: LinkedInIcon,
      },
      { platform: "github", url: "", Icon: GitHubIcon },
    ];

    render(
      <ProfilePreview profile={mockProfile} socials={socialsWithEmptyUrl} />,
    );

    const socialLinks = document.querySelectorAll('a[rel="noopener noreferrer"]');
    // Only LinkedIn should be rendered (1 social link, email has different attributes)
    expect(socialLinks).toHaveLength(1);
  });
});