const Blog = require('../models/blog');
const User = require('../models/user');

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
    return blogPosts.map(post => post.toJSON());
}

const usersInDB = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
}

module.exports = {
    initialBlogPosts,
    blogPostsInDb,
    usersInDB
}