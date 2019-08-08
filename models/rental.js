const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            isGold: {
                type: Boolean,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        }),
        required: true
    },

    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true
            },
            dailyRentalRate: {
                type: Number
            }
        }),
        required: true
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now 
    },

    dateReturned: {
        type: Date
    },

    rentalFee: {
        type: Number
    }

});

rentalSchema.statics.lookup = function(customerId, movieId){
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

rentalSchema.methods.return = function(){
    this.dateReturned = new Date();
    
    this.rentalFee = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validate(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(renatl, schema);
}

exports.Rental = Rental;
exports.validate = validate;
