require('express-async-errors');
//require('winston-mongodb');
const winston = require('winston');

module.exports = function(){
    /*there may be a winston method to handle this similar to below*/
    process.on('unhandledRejection', (ex) => {
        throw ex;
    })
    
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({filename: 'uncaughtExceptions.log'})
    )    
    
    winston.add(winston.transports.File, {filename: 'logmebabyonemoretime.log'})
    //winston.add(winston.transports.MongoDB, {db: 'mongodv://localhost/vidly', level: 'info'})// may want to use different db to log errors
    
}