const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('../models/genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {type: String, required: true, minlength: 3, maxlength: 100},
    genre: {
        type: genreSchema,
        required: true
    },
    inStock: {type: Number, default: 0},
    dailyRentalRate: {type: Number, default: 0}

}));

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        inStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }

    return Joi.validate(movie,schema);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;