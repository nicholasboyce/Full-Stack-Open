const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlogPost } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    });

    await page.goto('/');
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log into Application')).toBeVisible();
    const loginForm = await page.getByRole('form');
    await expect(loginForm).toBeVisible();
    await expect(loginForm.getByRole("button", { name: 'Login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen');
        await page.getByText('Blogs').waitFor();
        await expect(page.getByText('Blogs')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salutare');
        await page.getByText('invalid username or password').waitFor();
        await expect(page.getByText('invalid username or password')).toBeVisible();
    });
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen');
        await page.getByText('Blogs').waitFor();
    });

    test('a new blog can be created', async ({ page }) => {
        await createBlogPost(page, 'Marble Tiles', 'Rhiannon Parker', 'artdecostan.com');
        await expect(page.getByText('A new blog, Marble Tiles by Rhiannon Parker has been added!')).toBeVisible();
    });
  });
});