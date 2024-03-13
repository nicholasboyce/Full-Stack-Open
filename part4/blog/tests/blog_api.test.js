const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./helper');
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
    });
});



after(async () => {
    await mongoose.connection.close()
});