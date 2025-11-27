import { render } from "@testing-library/react";
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
});