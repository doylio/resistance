const {shuffle} = require('./shuffle');

class Game {
    constructor(room) {
        this.room = room;
        this.players = [];
        this.score = [0, 0];
        this.leader = 0;
        this.team = [];
        this.votes = [0, 0];
    }

    nameInUse(name) {
        return this.players.reduce((check, user) => user.name === name || check, false);
    }

    getPlayerListClean() {
        return this.players.map(user => ({
            name: user.name,
            id: user.id,
            actionPending: user.actionPending
        }));
    }

    actionCheck() {
        return this.players.reduce((check, user) => {
            return user.actionPending && check;
        }, true);
    }

    init() {
        this.players = shuffle(this.players);
        const numberOfSpies = Math.ceil(this.players.length / 3);
        for(let i = 0; i < numberOfSpies; i++) {
            this.players[i].role = 's';
        }
        this.players = shuffle(this.players);
        this.leader = Math.floor(Math.random() * this.players.length);
        this.mission = 0;
        return game;
    }

    getSpies() {
        return this.players.filter(user => user.role === 's');
    }

    getResistance() {
        return this.players.filter(user => user.role === 'r');
    }


}

class User {
    constructor(id, name, room, socket) {
        this.id = id;
        this.name = name;
        this.room = room;
        this.role = 'r';
        this.socket = socket;
        this.action = null,
        this.actionPending = false;
    }
}


class Store {
    constructor() {
        this.games = [];
        this.users = [];
    }

    addGame(room) {
        let game = new Game(room);
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

    addUser(id, name, room, socket) {
        let user = new User(id, name, room, socket);
        let game = this.getGame(room);
        if(!game) {
            game = this.addGame(room);
        }
        user.game = game;
        this.users.push(user);
        game.players.push(user);
        return user;
    }


    removeUser(id) {
        let user = this.getUser(id);
        user.game.players = user.game.players.filter(player => player.id !== id);
        if(user.game.players.length === 0) {
            this.removeGame(user.room);
        }
        this.users = this.users.filter(user => user.id !== id);
        return user;
    }

    getUser(id) {
        let user = this.users.find(user => user.id === id);
        return user;
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
        game.mission = 0;
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