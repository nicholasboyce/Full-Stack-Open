const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    });

    await page.goto('http://localhost:5173');
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log into Application')).toBeVisible();
    const loginForm = await page.getByRole('form');
    await expect(loginForm).toBeVisible();
    await expect(loginForm.getByRole("button", { name: 'Login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        const loginForm = await page.getByRole('form');
        await loginForm.getByLabel("Username").fill('mluukkai');
        await loginForm.getByLabel("Password").fill('salainen');
        await loginForm.getByRole("button", { name: 'Login' }).click();
        await expect(page.getByText('Blogs')).toBeVisible();
    }); 
    test('fails with wrong credentials', async ({ page }) => {
        const loginForm = await page.getByRole('form');
        await loginForm.getByLabel("Username").fill('mluukkai');
        await loginForm.getByLabel("Password").fill('salutare');
        await loginForm.getByRole("button", { name: 'Login' }).click();
        await expect(page.getByText('invalid username or password')).toBeVisible();
    });
  });
});