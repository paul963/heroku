const winston = require('winston');

const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/config')();
require('./startup/dbConnection')();
require('./startup/production')(app);

// Define the port to listen on
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));