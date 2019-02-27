//Libraries
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//Local
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Store} = require('./utils/store');

//Init
const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = socketIO(server);
const store = new Store();

//Middleware


io.on('connection', socket => {
	console.log('New user connected');
	socket.on('createMessage', (message, cb) => {
		let user = store.getUser(socket.id);
		if(user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		cb();
	});

	socket.on('updateReady', (ready, cb) => {
		let user = store.getUser(socket.id);
		user.ready = ready;
		io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} is ${ready ? 'ready' : 'not ready'}.`));
		cb();
	});

	socket.on('join', (data, cb) => {
		if(!isRealString(data.name) || !isRealString(data.room)) {
			return cb('Name and room are required');
		}

		if(store.getUserByName(data.name)) {
			return cb('That username is already taken');
		}

		socket.join(data.room);
		store.removeUser(socket.id);
		store.addUser(socket.id, data.name, data.room);
		let game = store.getGame(data.room);
		socket.emit('updatePhase', game.phase);
		
		io.to(data.room).emit('updateUserList', store.getUserList(data.room));
		socket.emit('newMessage', generateMessage('Admin', "Welcome to the game!"));
		socket.broadcast.to(data.room).emit('newMessage', generateMessage('Admin', `${data.name} has joined the game`));
		cb();
	});

	socket.on('disconnect', () => {
		let user = store.removeUser(socket.id);

		if(user) {
			io.to(user.room).emit('updateUserList', store.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the game`));
		}
	})
});


server.listen(port, () => console.log(`Server lisening on port ${port}`));

module.exports = {app};