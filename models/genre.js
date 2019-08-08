const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: true
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validate(genre){
    const schema = {
        genre: Joi.string().min(4).max(50).required()
    }    

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate= validate;