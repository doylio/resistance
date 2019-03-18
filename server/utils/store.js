const {shuffle} = require('./shuffle');

class Game {
    constructor(room) {
        this.room = room;
        this.players = [];
        this.score = [0, 0];
        this.leader = 0;
        this.team = [];
        this.yesVotes = [];
        this.noVotes = [];
        this.missionResults = [0, 0];
        this.missionNumber = 0;
    }

    nameInUse(name) {
        return this.players.reduce((check, user) => user.name === name || check, false);
    }

    getPlayerListClean() {
        return this.players.map(user => ({
            name: user.name,
            id: user.id,
            action: user.action,
        }));
    }

    noPendingActions() {
        return this.players.reduce((check, user) => {
            return (user.action === null) && check;
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
        this.missionNumber = 0;
        return this;
    }

    getSpies() {
        return this.players.filter(user => user.role === 's');
    }

    getResistance() {
        return this.players.filter(user => user.role === 'r');
    }

    checkTeamSelect(team) {
        let ids = this.players.map(user => user.id);
        let idCheck = team.reduce(((check, user) => ids.includes(user) && check), true);
        team.sort();
        let doublesCheck = true;
        for(let i = 0; i < team.length - 1; i++) {
            doublesCheck = doublesCheck && team[i] !== team[i + 1];
        }
        return idCheck && doublesCheck;
    }
    reset() {
        this.score = [0, 0];
        this.leader = 0;
        this.team = [];
        this.yesVotes = [];
        this.noVotes = [];
        this.missionResults = [0, 0];
        this.missionNumber = 0;
        this.players.forEach(user => {
            user.role = 'r';
            user.action = 'ready';
        });
    }

}

class User {
    constructor(id, name, room, socket) {
        this.id = id;
        this.name = name;
        this.room = room;
        this.role = 'r';
        this.socket = socket;
        this.action = 'ready';
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
        if(!user) {
            return;
        }
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
}

module.exports = {Store};