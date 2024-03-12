const blog = require("../models/blog");

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const sum = blogs.reduce((sum, curr) => {
        return sum + curr.likes;
    }, 0);

    return sum;
}

const favoriteBlog = (blogs) => {
    let favorite;
    let maxLikes = 0;
    for ({
        title,
        author,
        likes
    } of blogs) {
        if (likes > maxLikes) {
            maxLikes = likes;
            favorite = {
                title,
                author,
                likes
            }
        }
    }
    return favorite;
}

const mostBlogs = (blogs) => {
    const authors = new Map();
    let maxBlogs = 0;
    let mostBlogged = null;
    for (let i = 0; i < blogs.length; i++) {
        const currAuthor = blogs[i].author;
        let authorBlogs;
        if (authors.has(currAuthor)) {
            authorBlogs = authors.get(currAuthor) + 1;
            authors.set(currAuthor, authorBlogs);
        } else {
            authors.set(currAuthor, 1);
            authorBlogs = 1;
        }
        if (authorBlogs > maxBlogs) {
            maxBlogs = authorBlogs;
            mostBlogged = {
                author: currAuthor,
                blogs: authorBlogs
            }
        }
    }
    return mostBlogged;
}

const mostLikes = (blogs) => {
    const authors = new Map();
    let maxLikes = 0;
    let mostLiked = null;
    for (let i = 0; i < blogs.length; i++) {
        const currAuthor = blogs[i].author;
        let currLikes = blogs[i].likes;
        if (authors.has(currAuthor)) {
            const authLikes = authors.get(currAuthor);
            authors.set(currAuthor, authLikes + currLikes);
            currLikes = authLikes + currLikes;
        } else {
            authors.set(currAuthor, currLikes);
        }
        if (currLikes > maxLikes) {
            maxLikes = currLikes;
            mostLiked = {
                author: currAuthor,
                likes: currLikes
            }
        }
    }
    return mostLiked;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}