'use strict';

const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

let registerRoutes = (routes, method) => {
    for(let key in routes) {
        if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)){
            registerRoutes(routes[key], key);
        } else {
            if(method === 'get') {
                router.get(key, routes[key]);
            } else if (method === 'post') {
                router.post(key, routes[key]);
            } else {
                router.use(routes[key]);
            }
        }
    }
}

let route = routes => {
    registerRoutes(routes);
    return router;
}

//Find a single user based on a key
let findOne = profileID => {
    var query = db.userModel.findOne({
        'profileId': profileID
    });
    return query;
}

// Create a new user and returns his instance
let createNewUser = profile => {
    return new Promise((resolve, reject) => {
        let newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ''
        });
        newChatUser.save(error => {
            if(error){
                reject(error);
            } else {
                resolve(newChatUser);
            }
        })
    })
}

let findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (error, user) => {
            if(error) {
                reject(error);
            } else {
                resolve(user);
            }
        })
    })
}

// A middleware function to check if a user is logged in or not
let isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect('/');
    }
}

// A function for check if a chatroom exist in the db
let findRoomByName = (allrooms, room) => {
    let findRoom = allrooms.findIndex((element, index, array) => {
        if(element.room === room) {
            return true;
        } else {
            return false;
        }
    });
    return findRoom > -1 ? true : false;
}

let findRoomById = (allrooms, roomID) => {
    return allrooms.find((element, index, array) => {
        if(element.roomID === roomID) {
            return true;
        }
    });
}

let randomHex = () => {
    return crypto.randomBytes(24).toString('hex');
}

let addUserToRoom = (allrooms, data, socket) => {
    let getRoom = findRoomById(allrooms, data.roomID);
    if(getRoom !== undefined) {
        let userID = socket.request.session.passport.user;
        let checkUser = getRoom.users.findIndex((element, index, array) => {
            if(element.userID === userID) {
                return true;
            } else {
                return false;
            }
        });

        if(checkUser > -1) {
            getRoom.users.splice(checkUser, 1);
        }

        getRoom.users.push({
            socketID: socket.id,
            userID,
            user: data.user,
            userPic: data.userPic   
        });

        socket.join(data.roomID);
        return getRoom;
    } 
}

let removeUserFromRoom = (allrooms, socket) => {
    for(let room of allrooms) {
        let findUser = room.users.findIndex((element, index, array) => {
            if(element.socketID === socket.id) {
                return true;
            } else {
                return false;
            }
        });
        if(findUser > -1){
            socket.leave(room.roomID);
            room.users.splice(findUser, 1);
            return room;
        }
    }
}

module.exports = {
    route,
    findOne,
    createNewUser,
    findById,
    isAuthenticated,
    findRoomByName,
    randomHex,
    findRoomById,
    addUserToRoom,
    removeUserFromRoom
}