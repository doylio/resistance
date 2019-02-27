//Libraries
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//Local
const {generateMessage, generateSpyList} = require('./utils/message');
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
		if(store.readyCheck(user.room)) {
			let game = store.initGame(user.room);
			io.to(user.room).emit('updatePhase', game.phase);
			let spies = store.getSpies(user.room);
			spies.forEach((spy) => {
				let list = generateSpyList(spies, spy);
				io.sockets.socket[spy.id].emit('newMessage', generateMessage('Admin', `You are a spy.  Your teammates are ${list}.  Keep this information hidden and don't let anyone discover your identity.`));
			});
			let resistance = store.getResistance(user.room);
			resistance.forEach(resistance => {
				io.sockets.socket[resistance.id].emit('newMessage', generateMessage('Admin', `You are a member of the Resistance.  You should discover who the ${spies.length} spies are.  Anyone could be a traitor.`));
			});
		}
		cb();
	});

	socket.on('join', (data, cb) => {
		if(!isRealString(data.name) || !isRealString(data.room)) {
			return cb('Name and room are required');
		}
		let game = store.getGame(data.room);
		if(!game) {
			game = store.addGame(data.room);
		}

		if(store.nameInUse(data.name, data.room)) {
			return cb('That username is already taken');
		}

		socket.join(data.room);
		store.removeUser(socket.id);
		store.addUser(socket.id, data.name, data.room);
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