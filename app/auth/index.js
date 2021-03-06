'use strict';
const passport = require('passport');
const config = require('../config');
const h = require('../helpers');
const FacebookStrategy = require('passport-facebook').Strategy;
const logger = require('../logger');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
    
    passport.deserializeUser((id, done) => {
        h.findById(id)
            .then(user => done(null, user))
            .catch(error => logger.log('error','Error when deserializing the user'));
    });

    let authProcessor = (accessToken, refreshToken, profile, done) => {
        // Find a user in the local db using profile.id
        // If the user is found, return user data from db
        // If not - Create one in the local db
        h.findOne(profile.id)
            .then(result => {
                if(result) {
                    done(null, result);
                } else {
                    h.createNewUser(profile)
                        .then(newChatUser => done(null, newChatUser))
                        .catch(error => logger.log('error', 'Error when creating new user'))
                }
            });
    }
    passport.use(new FacebookStrategy(config.fb, authProcessor));
}