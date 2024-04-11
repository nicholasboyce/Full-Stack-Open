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
            const likes = 1;
            const likeButton = await likeBlogPost(page, 'Marble Tiles', 'Rhiannon Parker', likes);
            const buttonGroup = likeButton.locator('..');
            await buttonGroup.getByText(`likes: ${likes}`).waitFor();
            await expect(buttonGroup.getByText(`likes: ${likes}`)).toBeVisible();
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

        test('blogs appear in (descending) order of likes', async ({ page }) => {
            const twoLikePost = {
                title: 'Sailor Stars and You',
                author: 'Usagi Tsukino',
                url: 'bunhead.org'
            };
            const oneLikePost = {
                title: 'Testing is Important, Darnit!',
                author: 'FunFun FunctionGuy',
                url: 'testingisworthit.dev'
            };
            await createBlogPost(page, twoLikePost.title, twoLikePost.author, twoLikePost.url);
            await createBlogPost(page, oneLikePost.title, oneLikePost.author, oneLikePost.url);
            await likeBlogPost(page, twoLikePost.title, twoLikePost.author, 2);
            await likeBlogPost(page, oneLikePost.title, oneLikePost.author, 1);
            await page.reload();
            const blogPosts = page.locator('[class="blog"]');
            await expect(blogPosts.nth(0).getByText(`${twoLikePost.title} by ${twoLikePost.author}`, { exact: true })).toBeVisible();
            await expect(blogPosts.nth(1).getByText(`${oneLikePost.title} by ${oneLikePost.author}`, { exact: true })).toBeVisible();
            await expect(blogPosts.nth(2).getByText('Marble Tiles by Rhiannon Parker', { exact: true })).toBeVisible();
        });
    });
  });
});