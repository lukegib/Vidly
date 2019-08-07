const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');

//crud commands
router.post('/', auth, async(req, res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send("Invalid genre!");

    const newMovie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            genre: genre.genre
        },
        inStock: req.body.inStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await newMovie.save();
    console.log(`Saved!\n`);
    res.send(newMovie);
    
})

router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
})

router.get('/:id', async(req, res) => {
    
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send("That ID does not exist!");
    
    res.send(movie);
})

router.put('/:id', async(req, res) => {

    let result = validate(req.body); 
    if (result.error) return res.status(400).send("Invalid Input - Genre must be included"); 

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id, 
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                genre: genre.genre //maybe not best idea to name it genre...
            },
            inStock: req.body.inStock,
            dailyRentalRate: req.body.dailyRentalRate
        
        }, 
        {new: true});
    
    if(!movie) return res.status(404).send("That ID does not exist!");

    res.send(movie);
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if(!movie) return res.status(404).send("That ID does not exist!");
    
    res.send("Deleted it!");
})

module.exports = router;