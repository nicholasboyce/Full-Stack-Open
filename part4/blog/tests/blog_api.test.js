const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

describe('when there are blog posts initially saved', () => {

    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogPosts);
    });

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });

    test('all blog posts are returned', async () => {
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, helper.initialBlogPosts.length);
    });

    test('unique identifier of blog posts is their id', async () => {
        const response = await api.get('/api/blogs');
        const posts = response.body;
        for (const post of posts) {
            assert(post.id !== undefined);
            assert(post._id === undefined);
        }
    });

    describe('creating a post request to create a new blog post', () => {
        beforeEach(async () => {
            await User.deleteMany({});

            const passwordHash = await bcrypt.hash('sekret', 10);
            const user = new User({
                username: 'root',
                name: 'rootman',
                passwordHash
            });
    
            await user.save();
        });

        test('succeeds with complete data', async () => {
            const loggedInUser = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })
            .expect(200);

            const token = {'Authorization': `Bearer ${loggedInUser.body.token}`}
            const newPost = {
                "title": "Plentiful Life",
                "author": "Farro Bells", 
                "url": "belltitout.com",  
                "likes": 23,
            }

            await api
                .post('/api/blogs')
                .set(token)
                .send(newPost)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length + 1);

            const titles = postsInDb.map(post => post.title);
            assert(titles.includes('Plentiful Life'));
        });

        test('succeeds when likes property is missing', async () => {
            const loggedInUser = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            });

            const token = {Authorization: `Bearer ${loggedInUser.body.token}`}
            const newPost = {
                "title": "Plentiful Life",
                "author": "Farro Bells", 
                "url": "belltitout.com"
            }

            const response = await api
                .post('/api/blogs')
                .send(newPost)
                .set(token)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length + 1);

            const titles = postsInDb.map(post => post.title);
            assert(titles.includes('Plentiful Life'));

            assert.strictEqual(response.body.likes, 0);
        });

        test('fails when title property is missing', async () => {
            const loggedInUser = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            });

            const token = {Authorization: `Bearer ${loggedInUser.body.token}`}
            const newPost = {
                "author": "Farro Bells", 
                "url": "belltitout.com"
            }

            await api
                .post('/api/blogs')
                .send(newPost)
                .set(token)
                .expect(400);

            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length);

            const authors = postsInDb.map(post => post.author);
            assert(!authors.includes('Plentiful Life'));
        });

        test('fails when url property is missing', async () => {
            const loggedInUser = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            });

            const token = {Authorization: `Bearer ${loggedInUser.body.token}`}
            const newPost = {
                "title": "Plentiful Life",
                "author": "Farro Bells", 
            }

            await api
                .post('/api/blogs')
                .send(newPost)
                .set(token)
                .expect(400);

            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length);

            const titles = postsInDb.map(post => post.title);
            assert(!titles.includes('Plentiful Life'));
        });
    });

    describe('deleting a blog post', () => {
        const newPost = {
            "title": "Plentiful Life",
            "author": "Farro Bells", 
            "url": "belltitout.com"
        }

        test('returns 204 regardless of whether id is in database', async () => {
            const loggedInUser = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            });

            const token = {Authorization: `Bearer ${loggedInUser.body.token}`}
            const response = await api
                .post('/api/blogs')
                .send(newPost)
                .set(token)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const id = response.body.id;

            await api
                .delete(`/api/blogs/${id}`)
                .set(token)
                .expect(204);
            
            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length);

            const titles = postsInDb.map(post => post.title);
            assert(!titles.includes('Plentiful Life'));

            await api
                .delete(`/api/blogs/${id}`)
                .set(token)
                .expect(204);
        });
    });

    describe('updating an existing post', () => {
        const newPost = {
            "title": "Plentiful Life",
            "author": "Farro Bells", 
            "url": "belltitout.com",  
            "likes": 23
        }

        test('returns updated blog post on success', async () => {   
            const loggedInUser = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            });

            const token = {Authorization: `Bearer ${loggedInUser.body.token}`} 
            const postResponse = await api
                .post('/api/blogs')
                .send(newPost)
                .set(token)
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            const id = postResponse.body.id;
    
            const patchResponse = await api
                .patch(`/api/blogs/${id}`)
                .send({likes: 24})
                .expect(200)
                .expect('Content-Type', /application\/json/);
    
            assert.deepStrictEqual(patchResponse.body, {...postResponse.body, likes:24});
        });

        test('fails if id is non-existent', async () => {
            const loggedInUser = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            });

            const token = {Authorization: `Bearer ${loggedInUser.body.token}`}
            const postResponse = await api
                .post('/api/blogs')
                .send(newPost)
                .set(token)
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            const id = postResponse.body.id;
    
            await api
                .delete(`/api/blogs/${id}`)
                .set(token)
                .expect(204);

            await api
                .patch(`/api/blogs/${id}`)
                .send({likes: 24})
                .expect(404);
        });

        test('doesn\'t change target if update field is non-existent', async () => {
            const loggedInUser = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            });

            const token = {Authorization: `Bearer ${loggedInUser.body.token}`}
            const postResponse = await api
                .post('/api/blogs')
                .send(newPost)
                .set(token)
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            const id = postResponse.body.id;

            const patchResponse = await api
                .patch(`/api/blogs/${id}`)
                .send({plikes: 24})
                .expect(200);

            assert.deepStrictEqual(patchResponse.body, postResponse.body);
        });
    });
});

describe('when there is initially one user in the DB', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({
            username: 'root',
            name: 'rootman',
            passwordHash
        });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB();

        const newUser = {
            username: 'sarah1',
            name: 'sarahthekid',
            password: 'abc123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDB();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map(user => user.username);
        assert(usernames.includes(newUser.username));
    });

    test('all users can be seen from specific endpoint', async () => {
        const usersAtStart = await helper.usersInDB();

        const firstGetResponse = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.deepStrictEqual(firstGetResponse.body, usersAtStart);

        const newUser = {
            username: 'sarah1',
            name: 'sarahthekid',
            password: 'abc123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const secondGetReponse = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDB();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1, secondGetReponse.body.length);
        assert.deepStrictEqual(secondGetReponse.body, usersAtEnd);
    });

    test('creation fails with pre-used username',  async () => {
        const usersAtStart = await helper.usersInDB();

        const newUser = {
            username: 'root',
            name: 'sarahthekid',
            password: 'abc123'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        assert.deepStrictEqual(response.body, {error: 'username already exists'});

        const usersAtEnd = await helper.usersInDB();

        assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('creation fails with short username',  async () => {
        const usersAtStart = await helper.usersInDB();

        const newUser = {
            username: 'ro',
            name: 'password',
            password: 'abc123'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);

        assert.deepStrictEqual(response.body, {error: 'username and password must be at least 3 characters'});
        const usersAtEnd = await helper.usersInDB();

        assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('creation fails with short password',  async () => {
        const usersAtStart = await helper.usersInDB();

        const newUser = {
            username: 'root',
            name: 'sarahthekid',
            password: 'ab'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        

        assert.deepStrictEqual(response.body, {error: 'username and password must be at least 3 characters'});
        const usersAtEnd = await helper.usersInDB();

        assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });
});

after(async () => {
    await mongoose.connection.close()
});