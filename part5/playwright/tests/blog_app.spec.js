const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlogPost, likeBlogPost } = require('./helper');

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

    describe('and when there are blogs already present', () => {
        beforeEach(async ({ page }) => {
            await createBlogPost(page, 'Marble Tiles', 'Rhiannon Parker', 'artdecostan.com');
        });

        test('like button updates UI properly', async ({ page }) => {
            const likeButton = await likeBlogPost(page, 'Marble Tiles', 'Rhiannon Parker');
            const buttonGroup = likeButton.locator('..');
            await buttonGroup.getByText('likes: 1').waitFor();
            await expect(buttonGroup.getByText('likes: 1')).toBeVisible();
        });

        test('user who created the blog can delete the blog', async ({ page }) => {
            page.on('dialog', dialog => dialog.accept());
            const titleContainer = page.getByText('Marble Tiles by Rhiannon Parker', { exact: true }).locator('..');
            await titleContainer.getByRole('button').click();
            const removeButton = page.getByRole('button', { name: 'remove' });
            await removeButton.click();
            await expect(page.getByText('Marble Tiles by Rhiannon Parker', { exact: true })).toBeHidden();
        });

        test('users who did not create the blog cannot see the remove button', async ({ page, request }) => {
            await request.post('/api/users', {
                data: {
                  name: 'Nina Applina',
                  username: 'ninalina',
                  password: 'apples'
                }
            });

            await page.getByRole('button', { name: "Log out" }).click();
            await loginWith(page, "ninalina", "apples");
            const titleContainer = page.getByText('Marble Tiles by Rhiannon Parker', { exact: true }).locator('..');
            await titleContainer.getByRole('button').click();
            expect(page.getByRole('button', { name: 'remove' })).toBeHidden();
        });

        // test('blogs appear in (descending) order of likes', async ({ page }) => {
        //     await createBlogPost(page, 'Sailor Stars and You', 'Mamoru Chiba', 'justaguyinasuit.com');
        //     await createBlogPost(page, 'Testing is Important, Darnit!', 'FunFun FunctionGuy', 'testingisworthit.dev');

        //     const twoLikeContainer = page.getByText('Testing is Important, Darnit! by FunFun FunctionGuy', { exact: true }).locator('..');
        //     await twoLikeContainer.getByRole('button').click();
        //     const funLikeButton = page.getByRole('button', { name: 'Like' });
        //     await funLikeButton.click();
        //     await funLikeButton.click();

        //     const oneLikeContainer = page.getByText('Sailor Stars and You by Mamoru Chiba', { exact: true }).locator('..');
        //     await oneLikeContainer.getByRole('button').click();
        //     const starLikeButton = page.getByRole('button', { name: 'Like' });
        //     await starLikeButton.click();
        // });
    });
  });
});