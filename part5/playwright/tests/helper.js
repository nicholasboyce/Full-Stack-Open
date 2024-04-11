const loginWith =  async (page, username, password) => {
    const loginForm = await page.getByRole('form');
    await loginForm.getByLabel("Username").fill(username);
    await loginForm.getByLabel("Password").fill(password);
    await loginForm.getByRole("button", { name: 'Login' }).click();
};

const createBlogPost = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'Create new blog post' }).click();
    const createBlogForm = await page.getByRole('form', { name: 'create-blog-form' });
    await createBlogForm.getByLabel("Title").fill(title);
    await createBlogForm.getByLabel("Author").fill(author);
    await createBlogForm.getByLabel("URL").fill(url);
    await createBlogForm.getByRole('button').click();
    await page.getByText(`A new blog, ${title} by ${author} has been added!`).waitFor();
}

module.exports = { loginWith, createBlogPost };