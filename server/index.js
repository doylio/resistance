//Libraries
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//Local
const {generateMessage, generateSpyList, generateList} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Store} = require('./utils/store');
const {missionSize} = require('./utils/missionSize');


//Init
const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = socketIO(server);
const store = new Store();

//Middleware
app.use(express.static(__dirname + '/test'))


io.on('connection', socket => {
	socket.on('join', (data, cb) => {
		if(!isRealString(data.name) || !isRealString(data.room)) {
			return cb('Name and room are required');
		}
		let game = store.getGame(data.room);

		if(game && game.nameInUse(data.name)) {
			return cb('That username is already taken');
		}

		let user = store.addUser(socket.id, data.name, data.room, socket);
		socket.join(data.room);
		
		io.to(user.room).emit('update', {userList: user.game.getPlayerListClean()});
		socket.emit('newMessage', generateMessage('Admin', "Welcome to the game!"));
		socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has joined the game`));
		cb();
	});

	// = (text) =>
	socket.on('createMessage', (message, cb) => {
		let user = store.getUser(socket.id);
		if(user.game && isRealString(message.text)) {
			io.to(user.game.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		cb();
	});

	socket.on('updateReady', (ready, cb) => {
		let user = store.getUser(socket.id);
		if(!user) {
			return cb('You must join a game first.');
		}
		user.actionPending = ready;
		io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} is ready.`));
		let {game} = user;
		if(game.actionCheck()) {
			if(game.players.length > 4 && game.players.length < 11) {
				game.
			} else {
				io.to(game.room).emit('newMessage', generateMessage('Admin', 'The game requires 5-10 players to play.'));
			}
			store.initGame(game.room);
			let spies = store.getSpies(game.room);
			let resist = store.getResistance(game.room);
			spies.forEach(spy => {
				let spyList = generateSpyList(spies, spy);
				spy.socket.emit('newMessage', generateMessage('Admin', `You are a spy along with ${spyList}.  Don't let anybody discover your secret identity!`));
			});
			resist.forEach(resist => {
				resist.socket.emit('newMessage', generateMessage('Admin', `You are on the resistance.  Try to figure out who the ${spies.length} spies are before they sabotage your missions!`));
			});
			let leader = game.players[game.leader].socket;
			let playersToChoose = missionSize(game.players.length, game.mission);
			leader.emit('update', {phase: game.phase, playersToChoose});
			leader.emit('newMessage', generateMessage('Admin', `You are the team leader.  You must choose a team of ${playersToChoose} to go on a mission.`));
			leader.broadcast.to(game.room).emit('update', {phase: game.phase, playersToChoose: 0});
			leader.broadcast.to(game.room).emit('newMessage', generateMessage('Admin', `${game.players[game.leader].name} is the team leader.  He/she will select a team of ${playersToChoose}.`));
		}
		cb();
	});

	socket.on('selectTeam', (team, cb) => {
		let game = store.getGameByUser(socket.id);
		let leader = game.players[game.leader];
		if(socket.id !== leader.id) {
			return cb('You are not the mission leader');
		}
		let playersToChoose = missionSize(game.players.length, game.mission);
		if(team.length !== playersToChoose) {
			return cb(`Please select exactly ${playersToChoose} players.`);
		}
		let userList = store.getUserList(game.room);
		let nameCheck = team.reduce(((check, user) => userList.includes(user) && check), true);
		if(!nameCheck) {
			return cb('Invalid selection of players');
		}
		game.proposedTeam = team;
		game.phase = 'vote';
		game.players.forEach(player => player.ready = false);
		game.currentYesVotes = 0;
		io.to(game.room).emit('newMessage', generateMessage('Admin', `${leader.name} has selected ${generateList(team)} to go on this mission.  Please cast your vote in favour of or against this mission.`));
		io.to(game.room).emit('update', {phase: game.phase});
	});

	socket.on('vote', (vote) => {
		let game = store.getGameByUser(socket.id);
		let user = store.getUser(socket.id);
		if(!user.ready) {
			user.ready = true;
			if(vote) {
				game.currentYesVotes++;
			}
		}
		if(store.readyCheck(game.room)) {
			if(game.currentYesVotes >= game.players.length / 2) {
				game.phase = 'mission';
			} else {

			}
		}
	});

	socket.on('mission', (mission) => {
		//TODO
	});

	socket.on('disconnection', () => {
		//TODO
	})


	// socket.on('createMessage', (message) => {
	// 	let user = store.getUser(socket.id);
	// 	if(user && isRealString(message.text)) {
	// 		io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
	// 	}
	// 	// cb();
	// });

	// socket.on('updateReady', (ready, cb) => {
	// 	let user = store.getUser(socket.id);
	// 	user.ready = ready;
	// 	io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} is ${ready ? 'ready' : 'not ready'}.`));
	// 	if(store.readyCheck(user.room)) {
	// 		let game = store.initGame(user.room);
	// 		io.to(user.room).emit('updatePhase', game.phase);
	// 		let spies = store.getSpies(user.room);
	// 		spies.forEach((spy) => {
	// 			let list = generateSpyList(spies, spy);
	// 			io.sockets.socket[spy.id].emit('newMessage', generateMessage('Admin', `You are a spy.  Your teammates are ${list}.  Keep this information hidden and don't let anyone discover your identity.`));
	// 		});
	// 		let resistance = store.getResistance(user.room);
	// 		resistance.forEach(resistance => {
	// 			io.sockets.socket[resistance.id].emit('newMessage', generateMessage('Admin', `You are a member of the Resistance.  You should discover who the ${spies.length} spies are.  Anyone could be a traitor.`));
	// 		});
	// 	}
	// 	cb();
	// });

	// socket.on('join', (data, cb) => {
		// if(!isRealString(data.name) || !isRealString(data.room)) {
		// 	return cb('Name and room are required');
		// }
		// let game = store.getGame(data.room);
		// if(!game) {
		// 	game = store.addGame(data.room);
		// }

		// if(store.nameInUse(data.name, data.room)) {
		// 	return cb('That username is already taken');
		// }

		// socket.join(data.room);
		// store.removeUser(socket.id);
		// store.addUser(socket.id, data.name, data.room);
		// socket.emit('updatePhase', game.phase);
		
		// io.to(data.room).emit('updateUserList', store.getUserList(data.room));
		// socket.emit('newMessage', generateMessage('Admin', "Welcome to the game!"));
		// socket.broadcast.to(data.room).emit('newMessage', generateMessage('Admin', `${data.name} has joined the game`));
		// cb();
	// });

	// socket.on('disconnect', () => {
	// 	let user = store.removeUser(socket.id);

	// 	if(user) {
	// 		io.to(user.room).emit('updateUserList', store.getUserList(user.room));
    //         io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the game`));
	// 	}
	// })
});


server.listen(port, () => console.log(`Server lisening on port ${port}`));

module.exports = {app};