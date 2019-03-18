//Libraries
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//Local
const {generateMessage, generateSpyList, generateList} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Store} = require('./utils/store');
const {missionSize, doubleMission} = require('./utils/missionSize');


//Init
const app = express();
const port = process.env.PORT || 2323;
const server = http.createServer(app);
const io = socketIO(server);
const store = new Store();


io.on('connection', socket => {
	socket.on('join', (data, cb) => {
		//Validate
		if(!isRealString(data.name) || !isRealString(data.room)) {
			return cb('Name and room are required');
		}
		if(data.name.length > 14) {
			return cb('Name is too long.');
		}
		let game = store.getGame(data.room);
		if(data.name === 'Admin' || data.name === 'Game') {
			return cb('That username is reserved');
		}
		if(game && game.nameInUse(data.name)) {
			let namedUser = game.players.find(user => user.name === data.name);
			if(namedUser.socket.disconnected) {
				namedUser.socket = socket;
				namedUser.id = socket.id;
				io.to(game.room).emit('newMessage', generateMessage('Game', `${data.name} has reconnected.`));
				return cb();
			} else {
				return cb('That username is already taken');
			}
		}
		if(game && game.inProgress) {
			return cb('This game has already started.  You may join after it finishes.');
		}
		//Update store
		let user = store.addUser(socket.id, data.name, data.room, socket);
		socket.join(data.room);
		//Update clients
		io.to(user.room).emit('update', {userList: user.game.getPlayerListClean()});
		socket.emit('newMessage', generateMessage('Admin', "Welcome to the game!"));
		let {name, id} = user;
		socket.emit('userData', {name, id});
		socket.broadcast.to(user.room).emit('newMessage', generateMessage('Game', `${user.name} has joined the game`));
		cb(undefined, {name, id});
	});

	socket.on('createMessage', (message, cb) => {
		let user = store.getUser(socket.id);
		if(isRealString(message.text)) {
			io.to(user.game.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		cb();
	});

	socket.on('updateReady', (ready, cb) => {
		//Validate
		let user = store.getUser(socket.id);
		if(user.action !== 'ready') {
			return cb("Unauthorized action");
		}
		if(!user) {
			return cb('You must join a game first.');
		}
		//Update store
		user.action = null;
		//Update client
		io.to(user.room).emit('newMessage', generateMessage('Game', `${user.name} is ready.`));
		let {game} = user;
		io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
		//Check game status
		if(game.noPendingActions()) {
			if(game.players.length > 4 && game.players.length < 11) {
				game.init();
				let spies = game.getSpies();
				let resist = game.getResistance();
				spies.forEach(spy => {
					let spyList = generateSpyList(spies, spy);
					spy.socket.emit('newMessage', generateMessage('Admin', `You are a spy along with ${spyList}.  Don't let anybody discover your secret identity!`));
				});
				resist.forEach(resist => {
					resist.socket.emit('newMessage', generateMessage('Admin', `You are on the resistance.  Try to figure out who the ${spies.length} spies are before they sabotage your missions!`));
				});
				let leader = game.players[game.leader];
				let playersToChoose = missionSize(game.players.length, game.missionNumber);
				leader.action = 'choose-' + playersToChoose;
				io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
				// leader.socket.emit('newMessage', generateMessage('Admin', `You are the team leader.  You must choose a team of ${playersToChoose} to go on a mission.`));
				leader.socket.broadcast.to(game.room).emit('newMessage', generateMessage('Admin', `${game.players[game.leader].name} is the team leader.  He/she will select a team of ${playersToChoose}.`));
			} else {
				io.to(game.room).emit('newMessage', generateMessage('Admin', 'The game requires 5-10 players to play.'));
			}
		}
		cb();
	});

	socket.on('submitTeam', (team, cb) => {
		//Validate
		let user = store.getUser(socket.id);
		let {game} = user;
		let playersToChoose = missionSize(game.players.length, game.missionNumber);
		if(user.action !== `choose-${playersToChoose}`) {
			return cb('Unauthorized action');
		}
		let leader = game.players[game.leader];
		if(socket.id !== leader.id) {
			return cb('You are not the mission leader');
		}
		if(team.length !== playersToChoose) {
			return cb(`Please select exactly ${playersToChoose} players.`);
		}
		let check = game.checkTeamSelect(team);
		if(!check) {
			return cb('Invalid selection of players');
		}
		//Update store
		game.team = team.map(id => store.getUser(id));
		game.players.forEach(player => player.action = 'vote');
		game.votes = [0, 0];
		//Update clients
		let teamNames = team.map(id => store.getUser(id).name);
		io.to(game.room).emit('newMessage', generateMessage('Admin', `${leader.name} has selected ${generateList(teamNames)} to go on this mission.`));
		io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
	});

	socket.on('vote', (vote, cb) => {
		//Validate
		let user = store.getUser(socket.id);
		if(user.action !== 'vote') {
			return cb('Unauthorized action!');
		}
		//Update store
		let {game} = user;
		if(vote) {
			game.yesVotes.push(user.name);
		} else {
			game.noVotes.push(user.name);
		}
		user.action = null;
		//Update client
		io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
		//Check game status
		if(game.noPendingActions()) {
			//Display results
			io.to(game.room).emit('newMessage', generateMessage('Admin', `Vote Tally:  ${game.yesVotes.length}-${game.noVotes.length}\nVotes for:  ${generateList(game.yesVotes)}\nVotes against:  ${generateList(game.noVotes)}`));
			if(game.yesVotes.length < game.noVotes.length) {
				//Vote failed
				//Update store
				game.yesVotes = [];
				game.noVotes = [];
				game.team = [];
				game.leader = (game.leader + 1) % game.players.length;
				let leader = game.players[game.leader];
				let playersToChoose = missionSize(game.players.length, game.missionNumber);
				leader.action = 'choose-' + playersToChoose;
				//Update clients
				io.to(game.room).emit('newMessage', generateMessage('Admin', `Vote failed.  Moving to next team leader.`));
				io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
				// leader.socket.emit('newMessage', generateMessage('Admin', `You are the team leader.  You must choose a team of ${playersToChoose} to go on a mission.`));
				leader.socket.broadcast.to(game.room).emit('newMessage', generateMessage('Admin', `${game.players[game.leader].name} is the team leader.  He/she will select a team of ${playersToChoose}.`));
			} else {
				//Vote passed
				if(doubleMission(game.players.length, game.missionNumber)) {
					io.to(game.room).emit('newMessage', generateMessage('Admin', 'Vote passed.  The mission will progress.\n\nNOTE:  Special mission!  Two sabotages are required to fail this mission.'));
				} else {
					io.to(game.room).emit('newMessage', generateMessage('Admin', 'Vote passed.  The mission will progress.\n\nOne sabotage will fail this mission.'));
				}
				game.team.forEach(player => {
					player.action = 'mission';
				});
				io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
			}
		}
	});

	socket.on('mission', (mission, cb) => {
		//Validate
		let user = store.getUser(socket.id);
		if(user.action !== 'mission') {
			return cb('Unauthorized action!');
		}
		//Update store
		let {game} = user;
		if(user.role === 'r') {
			game.missionResults[0]++;
		} else {
			if(mission) {
				game.missionResults[0]++;
			} else {
				game.missionResults[1]++;
			}
		}
		
		user.action = null;
		io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
		if(game.noPendingActions()) {
			if((game.missionResults[1] > 0 && !doubleMission(game.players.length, game.missionNumber)) 
			|| game.missionResults[1] > 1) {
				//Sabotaged
				game.score[1]++;
				io.to(game.room).emit('newMessage', generateMessage('Admin', `The mission was sabotaged by ${game.missionResults[1]} player${game.missionResults[1] < 1 ? 's' : ''}.`));
				io.to(game.room).emit('missionResult', false);
			} else {
				//Successful
				game.score[0]++;
				io.to(game.room).emit('missionResult', true);
				if(game.missionResults[1] === 1){
					io.to(game.room).emit('newMessage', generateMessage('Admin', 'Mission succeeded!  There was only one saboteur on the mission, so they failed to sabotage.'))
				} else {
					io.to(game.room).emit('newMessage', generateMessage('Admin', 'Mission succeeded!  Nobody tried to sabotage.'));
				}
			}
			//Display score
			io.to(game.room).emit('newMessage', generateMessage('Admin', `SCORE:\nResistance:  ${game.score[0]}\nSpies:  ${game.score[1]}`));
			//Check for win
			if(game.score[0] === 3 || game.score[1] === 3) {
				let spyList = generateList(game.getSpies().map(user => user.name));
				if(game.score[0] === 3) {
					//Resistance wins
					io.to(game.room).emit('newMessage', generateMessage('Admin', `The resistance wins!  ${spyList} were the spies.`));
				} else {
					//Spies win
					io.to(game.room).emit('newMessage', generateMessage('Admin', `The spies wins!  ${spyList} were the spies.`));
				}
				game.reset();
				io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
				io.to(game.room).emit('newMessage', generateMessage('Game', 'Ready up to play again'));
			} else {
				//Continue game
				game.missionNumber++;
				game.missionResults = [0, 0];
				game.yesVotes = [];
				game.noVotes = [];
				game.team = [];
				game.leader = (game.leader + 1) % game.players.length;
				let leader = game.players[game.leader];
				let playersToChoose = missionSize(game.players.length, game.missionNumber);
				leader.action = 'choose-' + playersToChoose;
				//Update clients
				io.to(game.room).emit('update', {userList: game.getPlayerListClean()});
				// leader.socket.emit('newMessage', generateMessage('Admin', `You are the team leader.  You must choose a team of ${playersToChoose} to go on a mission.`));
				leader.socket.broadcast.to(game.room).emit('newMessage', generateMessage('Admin', `${game.players[game.leader].name} is the team leader.  He/she will select a team of ${playersToChoose}.`));
				if(doubleMission(game.players.length, game.missionNumber)) {
					io.to(game.room).emit('newMessage', generateMessage('Admin', '**NOTE** This is a special mission.  There must be two sabotages on this mission for the spies to get the point!'));
				}
			}
		}
	});

	socket.on('disconnect', () => {
		//Five minutes to reconnect
		let user = store.getUser(socket.id);
		if(!user) {
			return;
		}
		io.to(user.room).emit('newMessage', generateMessage('Game', `${user.name} has disconnected.  They have five minutes to reconnect.`));
		setTimeout(() => {
			let user = store.removeUser(socket.id);
			if(user) {
				io.to(user.room).emit('update', {userList: user.game.getPlayerListClean()});
			}
		}, 300000);
	});
});


server.listen(port, () => console.log(`Server lisening on port ${port}`));