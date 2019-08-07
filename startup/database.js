const mongoose = require('mongoose');
const winston = require('winston')
const config = require('config');

module.exports = async function(){
    const database = config.get('database');
    await mongoose.connect(database)
     .then( () => winston.info(`Connected to ${database}`));
}