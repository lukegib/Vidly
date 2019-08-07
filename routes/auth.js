
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

router.post('/', async(req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send("Error my friend");

    let user = await User.findOne({email: req.body.email}) //check if user already exists
    if(!user) return res.status(400).send('Email address or password incorrect');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Email address or password incorrect');


    // note - client deletes token when user logs out - dont store tokens in database
    const token = user.generateAuthToken();
    res.send(token);
})

function validate(req){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(32).required()
    }

    return Joi.validate(req, schema)
}

module.exports = router;