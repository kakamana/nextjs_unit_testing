import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ProfileForm from '../components/ProfileForm';
import { ImageUpload } from '../components/input-fields/ImageUpload';
import '@testing-library/jest-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  const mockProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    description: 'A software developer.',
    imageUrl: null,
  };

  const mockSocials = [
    {
      platform: 'x',
      url: 'https://x.com/johndoe',
      Icon: Twitter,
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/johndoe',
      Icon: Linkedin,
    },
    {
      platform: 'github',
      url: 'https://github.com/johndoe',
      Icon: Github,
    },
  ];

  const mockOnChange = jest.fn();
  const mockOnImageChange = jest.fn();
  const mockOnSocialChange = jest.fn();

  it('should have no accessibility violations in ProfileForm component', async () => {
    const { container } = render(
      <ProfileForm
        profile={mockProfile}
        socials={mockSocials}
        onProfileChange={mockOnChange}
        onImageChange={mockOnImageChange}
        onSocialChange={mockOnSocialChange}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in ImageUpload component', async () => {
    const { container } = render(<ImageUpload handleChange={mockOnChange} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
