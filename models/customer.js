const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {type: Boolean, default: false},
    name: {type: String, required: true},
    phone: String
}));

function validate(customer){
    const schema = {
        name: Joi.string().required(),
        phone: Joi.string().required(),
        isGold: Joi.boolean()
    }    

    return Joi.validate(genre, schema);
}

exports.Customer = Customer;
exports.validate = validate;