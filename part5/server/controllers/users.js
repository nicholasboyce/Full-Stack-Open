const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    if (username.length < 3 || password.length < 3) {
        return response.status(400).send({error: 'username and password must be at least 3 characters'});
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
    let users = await User.find({}).populate('blogs', { url:1, title:1, author:1 });
    response.json(users);
});

module.exports = usersRouter;