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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}