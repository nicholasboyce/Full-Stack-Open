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
        test('succeeds with valid data', async () => {
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
    });
});



after(async () => {
    await mongoose.connection.close()
});