const blogRouter = require('express').Router()
const middleware = require('../utils/middleware');
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
    response.json(blogs)
});

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    let body = request.body;
    if (body.url === undefined || body.title === undefined) {
        response.status(400).send({Error: 'Missing content'});
    } else {
        if (body.likes === undefined) {
            body = {...body, likes: 0}
        }
        const user = request.user;
        body = {
            ...body,
            user: user._id 
        }
        const blog = new Blog(body);
        const result = await blog.save();
        user.blogs = user.blogs.concat(result._id);
        await user.save();
        response.status(201).json(result);
    }
});

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user;
    const blogToDelete = await Blog.findById(request.params.id);
    if (blogToDelete && blogToDelete.user.toString() === user.id.toString()) {
        const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
        user.blogs = user.blogs.filter(post => post !== deletedBlog._id);
        await user.save();
    }
    response.status(204).end();
});

blogRouter.patch('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user;
    const blogToUpdate = await Blog.findById(request.params.id);
    if (blogToUpdate && blogToUpdate.user.toString() === user.id.toString()) {
        const updated = await Blog.findByIdAndUpdate(request.params.id, request.body, { new:true });
        response.status(200).json(updated);
    } else {
        response.status(404).end();
    }
});

module.exports = blogRouter

