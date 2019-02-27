const {shuffle} = require('./shuffle');

class Store {
    constructor() {
        this.users = [];
        this.games = [];
    }

    addGame(room) {
        let game = {
            room,
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
        let user = {id, name, room, ready: false};
        if(!this.getGame(room)) {
            this.addGame(room);
        }
        this.users.push(user);
        return user;
    }


    removeUser(id) {
        let removedUser = this.users.find(user => user.id === id);
        this.users = this.users.filter(user => user.id !== id);
        return removedUser;
    }

    getUserByName(name) {
        return this.users.find(user => user.name === name);
    }

    getUser(id) {
        return this.users.find(user => user.id === id);
    }

    getUserList(room) {
        return this.users.filter(user => user.room === room).map(user => user.name);
    }

    initGame(room) {
        let game = this.getGame(room);
        let players = this.users.filter(user => user.room === room);
        game.players = shuffle(players);
        const numberOfSpies = Math.ceil(players.length / 3);
        
    }
}

module.exports = {Store};