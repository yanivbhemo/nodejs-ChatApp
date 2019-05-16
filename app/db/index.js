'use strict';
const config = require('../config');
const Mongoos = require('mongoose').connect(config.dbURI);

Mongoos.connection.on('error', error => {
    console.log("MongoDB Error: ", error);
});

module.exports = {
    Mongoos
}