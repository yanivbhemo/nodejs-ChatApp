'use strict';
const config = require('../config');
const mongoose_con = require('mongoose');
const logger = require('../logger');
mongoose_con.connect(config.dbURI, {useNewUrlParser: true});
const Mongoos = mongoose_con.connection;
Mongoos.on('error', () => {
  logger.log('error', 'Mongoose connection error' + error);
});
Mongoos.once('open', function() {
  logger.log('info', "DB Connected");
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