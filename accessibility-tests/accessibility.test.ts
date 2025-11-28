import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ProfileForm from '../components/ProfileForm';
import ImageUpload from '../components/input-fields/ImageUpload';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should have no accessibility violations in ProfileForm component', async () => {
    const { container } = render(<ProfileForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in ImageUpload component', async () => {
    const { container } = render(<ImageUpload />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
