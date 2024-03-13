const Blog = require('../models/blog');

const initialBlogPosts = [
    {
        "title": "The Way Back Home",
        "author": "Arto Hellas", 
        "url": "artybooks.com",  
        "likes": 12
    },
    {
        "title": "I Smell Toast And I'm Hungry",
        "author": "Arto Hellas", 
        "url": "artybooks.com",  
        "likes": 17
    },
    {
        "title": "I Smell Toast And I'm REALLY Hungry",
        "author": "Arto Hellas", 
        "url": "artybooks.com",  
        "likes": 17
    }
];

const blogPostsInDb = async () => {
    const blogPosts = await Blog.find({});
    return blogPosts;
}

module.exports = {
    initialBlogPosts,
    blogPostsInDb
}