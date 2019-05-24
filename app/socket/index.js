'use strict';

const h = require('../helpers');

module.exports = (io, app) => {
    let allrooms = app.locals.chatrooms;

    // allrooms.push({
    //     room: 'Good Food',
    //     roomID: '0001',
    //     users: []
    // });

    // allrooms.push({
    //     room: 'Cloud Computing',
    //     roomID: '0002',
    //     users: []
    // });

    io.of('/roomsList').on('connection', socket => {
        socket.on('getChatRooms', () => {
            socket.emit('chatRoomsList', JSON.stringify(allrooms));
        });

        socket.on('createNewRoom', (newRoomInput) => {
            if(!h.findRoomByName(allrooms, newRoomInput)){
                allrooms.push({
                    room: newRoomInput,
                    roomID: h.randomHex(),
                    users: []
                });
                socket.emit('chatRoomsList', JSON.stringify(allrooms));
                socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
            }
        });
    });

    io.of('/chatter').on('connection', socket => {
        socket.on('join', data => {
            let usersList = h.addUserToRoom(allrooms, data, socket);
            socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
            socket.emit('updateUsersList', JSON.stringify(usersList.users));
        });

        socket.on('disconnect', () => {
            let room = h.removeUserFromRoom(allrooms, socket);
            socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
        });

        socket.on('newMessage', (data) => {
            socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
        });
    });
}