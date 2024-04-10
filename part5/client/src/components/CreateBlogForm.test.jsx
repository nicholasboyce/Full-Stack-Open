import CreateBlogForm from './CreateBlogForm';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';


describe('<CreateBlogForm />', () => {
  let container;
  const mockUpdate = vi.fn();
  const mockCreate = vi.fn().mockResolvedValue(
    {
      status: 201,
      async json() {
        return Promise.resolve({
          title: 'Test Blog',
          author: 'Space Dog'
        });
      }
    });
  const user = userEvent.setup();
  beforeEach(() => {
    container = render(<CreateBlogForm updateBlogStatus={mockUpdate} createBlogPost={mockCreate} />).container;
  });

  test('calls passed in functions upon form submission', async () => {
    const submitButton = screen.getByRole('button');
    await user.click(submitButton);
    expect(mockCreate).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
  });
});