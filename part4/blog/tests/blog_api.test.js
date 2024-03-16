const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper');
const Blog = require('../models/blog');

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
        test('succeeds with complete data', async () => {
            const newPost = {
                "title": "Plentiful Life",
                "author": "Farro Bells", 
                "url": "belltitout.com",  
                "likes": 23
            }

            await api
                .post('/api/blogs')
                .send(newPost)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length + 1);

            const titles = postsInDb.map(post => post.title);
            assert(titles.includes('Plentiful Life'));
        });

        test('succeeds when likes property is missing', async () => {
            const newPost = {
                "title": "Plentiful Life",
                "author": "Farro Bells", 
                "url": "belltitout.com"
            }

            const response = await api
                .post('/api/blogs')
                .send(newPost)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length + 1);

            const titles = postsInDb.map(post => post.title);
            assert(titles.includes('Plentiful Life'));

            assert.strictEqual(response.body.likes, 0);
        });

        test('fails when title property is missing', async () => {
            const newPost = {
                "author": "Farro Bells", 
                "url": "belltitout.com"
            }

            await api
                .post('/api/blogs')
                .send(newPost)
                .expect(400);

            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length);

            const authors = postsInDb.map(post => post.author);
            assert(!authors.includes('Plentiful Life'));
        });

        test('fails when url property is missing', async () => {
            const newPost = {
                "title": "Plentiful Life",
                "author": "Farro Bells", 
            }

            await api
                .post('/api/blogs')
                .send(newPost)
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
            const response = await api
                .post('/api/blogs')
                .send(newPost)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const id = response.body.id;

            await api
                .delete(`/api/blogs/${id}`)
                .expect(204);
            
            const postsInDb = await helper.blogPostsInDb();
            assert.strictEqual(postsInDb.length, helper.initialBlogPosts.length);

            const titles = postsInDb.map(post => post.title);
            assert(!titles.includes('Plentiful Life'));

            await api
                .delete(`/api/blogs/${id}`)
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
            const postResponse = await api
                .post('/api/blogs')
                .send(newPost)
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            const id = postResponse.body.id;
    
            const patchResponse = await api
                .patch(`/api/blogs/${id}`)
                .send({likes: 24})
                .expect(200)
                .expect('Content-Type', /application\/json/);
    
            assert.deepStrictEqual(patchResponse.body, {...newPost, id, likes: 24});
        });

        test('fails if id is non-existent', async () => {
            const postResponse = await api
                .post('/api/blogs')
                .send(newPost)
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            const id = postResponse.body.id;
    
            await api
                .delete(`/api/blogs/${id}`)
                .expect(204);

            await api
                .patch(`/api/blogs/${id}`)
                .send({likes: 24})
                .expect(404);
        });

        test('doesn\'t change target if update field is non-existent', async () => {
            const postResponse = await api
                .post('/api/blogs')
                .send(newPost)
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            const id = postResponse.body.id;

            const patchResponse = await api
                .patch(`/api/blogs/${id}`)
                .send({plikes: 24})
                .expect(200);

            assert.deepStrictEqual(patchResponse.body, {...newPost, id});
        });
    });
});


after(async () => {
    await mongoose.connection.close()
});