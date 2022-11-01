const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)  //configure socketio to work with server

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

//let count = 0;
//new connections

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

// //Sending to clients who are receiving
// socket.emit('countUpdated', count);
//
// //listening to event increment
// socket.on('increment', () => {
//     count++;
//     io.emit('countUpdated', count);
// });
//

//Send
//socket.emit('message', generateMessage('Welcome!'))
//socket.broadcast.emit('message', generateMessage('A new user has joined!'))

//socket.on('join', ({ username, room }) => {
    // socket.join(room)
    // socket.emit('message', generateMessage('Welcome!'))
    // socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
    // socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit           
    //....to is to emit to some particular room 
//})

socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options })

    if (error) {
        return callback(error)
    }

    socket.join(user.room)

    socket.emit('message', generateMessage('Admin', 'Welcome!'))
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
    io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
    })

    callback()
})

//Waiting to receive msg
socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter()

    if (filter.isProfane(message)) {
        return callback('Profanity is not allowed!')
    }

//    io.emit('message', generateMessage(message));
io.to(user.room).emit('message', generateMessage(user.username, message))
callback()
})

//Waiting to receive locations
socket.on('sendLocation', (coords, callback) => {

//    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
const user = getUser(socket.id)
io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
callback()
})

socket.on('disconnect', () => {
//    io.emit('message', generateMessage('A user has left!'));
const user = removeUser(socket.id)
if (user) {
    io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
    io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
    })
}
})
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});