require('dotenv').config();

var express = require('express');
var winston = require('winston');
var app = express();
require('./app')(app);

app.listen(app.get('port'), () => {
    winston.info(`Irregular Please is on PORT:${app.get('port')}`);
});