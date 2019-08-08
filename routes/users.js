const _ = require('lodash');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User, validate} = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth'); //authorization NOT authentication
//joi password complexity

router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})


router.post('/', async(req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let newUser = await User.findOne({email: req.body.email}) //check if user already exists
    if(newUser) return res.status(400).send('User already registered.');

    newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password

        //_.pick(req.body, ['name', 'email', 'password']);
    })
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();
    
    const token = newUser.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(newUser, ['name', 'email'])); //lodash

})

module.exports = router;