'use strict';
const config = require('../config');
const Mongoos = require('mongoose').connect(config.dbURI);

Mongoos.connection.on('error', error => {
    console.log("MongoDB Error: ", error);
});

const chatUser = new Mongoos.Schema({
    profileId: String, 
    fullName: String,
    profilePic: String
});

let userModel = Mongoos.model('chatUser', chatUser);

module.exports = {
    Mongoos,
    userModel
}