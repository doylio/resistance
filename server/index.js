//Libraries
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//Local
const {generateMessage} = require('./utils/message');

//Server configuration
const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = socketIO(server);

//Middleware


io.on('connection', socket => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the game'));

	socket.on('createMessage', (message, cb) => {
		io.emit('newMessage', generateMessage('User', message.text));
		cb();
	});

	socket.on('join', (data, cb) => {
		
		
	});
});


server.listen(port, () => console.log(`Server lisening on port ${port}`));

module.exports = {app};