//Libraries
const express = require('express');
const io = require('socket.io')();

//Local


//Server configuration
const app = express();
const port = process.env.PORT || 3000;

//Middleware


io.on('connection', (client) => {
	console.log('New user connected');
});


app.listen(port, () => console.log(`Server lisening on port ${port}`));

module.exports = {app};