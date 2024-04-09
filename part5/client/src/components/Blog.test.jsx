import { render, screen } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

describe('<Blog />', () => {
  let container;
  const blog = {
    title: 'Test Blog',
    author: 'Space Dog',
    url: 'invincible',
    likes: 3,
    user: {
      username: 'seancedog',
      name: 'Marvin',
      id: '123456789',
    }
  };
  const user = userEvent.setup();
  const likeUp = vi.fn();

  beforeEach(() => {
    container = render(<Blog blog={blog} username='seancedog' likeUp={likeUp}/>).container;
  });

  test('renders title and author by default', async () => {
    await screen.findByText('Test Blog by Space Dog');
  });

  test('only renders URL after click to show', async () => {
    const defaultNotVisible = screen.queryByText(blog.url);
    expect(defaultNotVisible).toBeNull();

    const viewButton = screen.getByText('View');
    await user.click(viewButton);
    expect(viewButton.textContent).toBe('Cancel');

    screen.getByText(blog.url);
  });

  test('only renders likes after click to show', async () => {
    const defaultNotVisible = screen.queryByText(blog.likes);
    expect(defaultNotVisible).toBeNull();

    const viewButton = screen.getByText('View');
    await user.click(viewButton);
    expect(viewButton.textContent).toBe('Cancel');

    screen.getByText(`likes: ${blog.likes}`);
  });

  test('update like button function is called after button is pressed', async () => {
    const viewButton = screen.getByText('View');
    await user.click(viewButton);

    const likeButton = screen.getByText('Like');
    let likeCount = screen.getByText(`likes: ${blog.likes}`);
    expect(likeCount.textContent).toBe('likes: 3');

    await user.click(likeButton);
    expect(likeUp.mock.calls).toHaveLength(1);

    await user.click(likeButton);
    expect(likeUp.mock.calls).toHaveLength(2);
  });
});