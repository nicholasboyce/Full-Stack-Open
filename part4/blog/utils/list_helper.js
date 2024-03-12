const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const sum = blogs.reduce((sum, curr) => {
        return sum + curr.likes;
    }, 0);

    return sum;
}

module.exports = {
    dummy,
    totalLikes
}