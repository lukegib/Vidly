const winston = require('winston');
const express = require('express');

const app = express();

require('./startup/logging')();
require('./startup/configuration')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/debug');
require('./startup/prod')(app);

const port = process.env.PORT || 3000
const server = app.listen(port, () => winston.info(`Listening on Port ${port}`));

module.exports = server;