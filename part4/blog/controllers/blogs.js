const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
});

blogRouter.post('/', async (request, response) => {
    let body = request.body;
    if (body.url === undefined || body.title === undefined) {
        response.status(400).send({Error: 'Missing content'});
    } else {
        if (body.likes === undefined) {
            body = {...body, likes: 0}
        }
        const blog = new Blog(body);
        const result = await blog.save();
        response.status(201).json(result);
    }
});

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

blogRouter.patch('/:id', async (request, response) => {
    const updated = await Blog.findByIdAndUpdate(request.params.id, request.body, { new:true });
    if (updated) {
        response.status(200).json(updated);
    } else {
        response.status(404).end();
    }
});

module.exports = blogRouter
