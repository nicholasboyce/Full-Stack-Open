const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
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
        const decodedToken = jwt.verify(request.token, process.env.SECRET)  
        if (!decodedToken.id) {    
            return response.status(401).json({ error: 'token invalid' })  
        }  
        const user = await User.findById(decodedToken.id)
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

