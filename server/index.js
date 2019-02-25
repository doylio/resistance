//Libraries
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//Local


//Server configuration
const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = socketIO(server);

//Middleware


io.on('connection', (client) => {
	console.log('New user connected');

	client.emit('newMessage', {
		from: 'Admin',
		createdAt: '7:34pm',
		text: 'Here is a message'
	});

});


server.listen(port, () => console.log(`Server lisening on port ${port}`));

module.exports = {app};