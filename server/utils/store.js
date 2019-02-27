const {shuffle} = require('./shuffle');

class Store {
    constructor() {
        this.games = [];
    }

    addGame(room) {
        let game = {
            room,
            players: [],
            phase: 'setup',
            score: {
                resistance: 0,
                spies: 0,
            },
            leader: 0,
            proposedTeam: [],
            currentYesVotes: 0,
            currentVotes: 0,
        };
        this.games.push(game);
        return game;
    }

    getGame(room) {
        return this.games.find(game => game.room === room);
    }

    removeGame(room) {
        let removedGame = this.games.find(game => game.room === room);
        this.games = this.games.filter(game => game.room !== room);
        return removedGame;
    }

    addUser(id, name, room) {
        let game = this.getGame(room);
        let user = {id, name, role: 'R'};
        game.players.push(user);
        return user;
    }


    removeUser(id) {
        let game = this.getGameByUser(id);
        if(!game) {
            return undefined;
        }
        let user = game.players.find(player => player.id === id);
        game.players = game.players.filter(player => player.id !== id);
        return user;
    }

    getUser(id) {
        let allUsers = this.games.reduce((userArr, game) => userArr.concat(game.players), []);
        return allUsers.find(user => user.id === id);
    }

    getGameByUser(id) {
        let userGame = undefined;
        this.games.forEach(game => {
            game.players.forEach(player => {
                if(player.id === id) {
                    userGame = game;
                }
            })
        });
        return userGame;
    }

    getUserList(room) {
        return this.getGame(room).players;
    }

    readyCheck(room) {
        let players = this.getUserList(room);
        return players.reduce((ready, user) => {
            if(user.ready) {
                return ready;
            } else {
                return false;
            }
        }, true);
    }

    initGame(room) {
        let game = this.getGame(room);
        game.players = shuffle(game.players);
        const numberOfSpies = Math.ceil(game.players.length / 3);
        for(let i = 0; i < numberOfSpies; i++) {
            game.players[i].role = 'S';
        }
        game.players = shuffle(game.players);
        game.leader = Math.floor(Math.random() * game.players.length);
        game.phase = 'mission-select';
        return game;
    }

    getSpies(room) {
        let game = this.getGame(room);
        return game.players.filter(user => user.role === 'S');
    }

    getResistance(room) {
        let game = this.getGame(room);
        return game.players.filter(user => user.role === 'R');
    }
}

module.exports = {Store};