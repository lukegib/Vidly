const validateObjectID = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');

//crud commands
router.post('/', auth, async(req, res) => {

    const{error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const newGenre = new Genre({
        genre: req.body.genre
    })

    await newGenre.save();
    res.send(newGenre);

})

router.get('/', async(req, res, next) => {

    const genres = await Genre.find().sort('name');
    res.send(genres);
})

router.get('/:id', validateObjectID, async(req, res) => {
    const genre = await Genre.findById(req.params.id);
    
    if(!genre) return res.status(404).send("That ID does not exist!");
    
    res.send(genre);
})

router.put('/:id', [auth, validateObjectID], async(req, res) => {
    
    const{error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    const genre = await Genre.findByIdAndUpdate(req.params.id, {genre: req.body.genre}, { new: true});
    
    if(!genre) return res.status(404).send("That ID does not exist!");

    res.send(genre);
})

router.delete('/:id', [auth, admin, validateObjectID], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(404).send("That ID does not exist!");
    
    res.send(genre);
})

module.exports = router;