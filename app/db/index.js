'use strict';
const config = require('../config');
const mongoose_con = require('mongoose');
mongoose_con.connect(config.dbURI, {useNewUrlParser: true});
const Mongoos = mongoose_con.connection;
Mongoos.on('error', console.error.bind(console, 'connection error:'));
Mongoos.once('open', function() {
  console.log("DB Connected");
});

Mongoos.Promise = require('bluebird');

const chatUserSchema = {
    profileId: String, 
    fullName: String,
    profilePic: String
};

let userModel = Mongoos.model('chatUser', chatUserSchema);

module.exports = {
    Mongoos,
    userModel
}