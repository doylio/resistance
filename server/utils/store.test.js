const expect = require('expect');

let {Store} = require('./store');
let {testGames, testPlayers} = require('./seed');

let store;
beforeEach(() => {
    store = new Store();
    store.games = testGames;
    store.users = testPlayers;
});


describe('store.getGame(room)', () => {
    it('should return the correct game', () => {
        let room = 'B';
        let game1 = testGames[1];
        let game2 = store.getGame(room);
        expect(game1).toMatchObject(game2);
   });

    it('should not return a game', () => {
        let room = 'X';
        let game = store.getGame(room);
        expect(game).not.toBeDefined();
   });
});

describe('store.removeGame(room)', () => {
    it('should remove the game', () => {
        let room = 'C';
        let game = store.removeGame(room);
        expect(store.games.length).toBe(2);
        expect(store.games[0]).toMatchObject(testGames[0]);
        expect(store.games[1]).toMatchObject(testGames[1]);
        expect(store.games[2]).not.toBeDefined();
        expect(game).toBeDefined();
   });

   it('should not remove a game', () => {
        let room = 'Y';
        let game = store.removeGame(room);
        expect(store.games.length).toBe(3);
        expect(store.games[0]).toMatchObject(testGames[0]);
        expect(store.games[1]).toMatchObject(testGames[1]);
        expect(store.games[2]).toMatchObject(testGames[2]);
        expect(game).not.toBeDefined();
   });
});

describe('store.addGame(room)', () => {
    it('should add a new game', () => {
        let store = new Store();
        let room = 'Z';
        let game = store.addGame(room);
        expect(store.games.length).toBe(1);
        expect(store.games.reverse()[0]).toMatchObject(game);
    });
});

describe('store.getUser(id)', () => {
    it('should return the correct user', () => {
        let id = '4';
        let expected = {
            id: '4',
            name: 'Devin',
            role: 'r',
            action: null,
        };
        let user = store.getUser(id);
        expect(user).toMatchObject(expected);
    });

    it('should return undefined', () => {
        let id = '69';
        let user = store.getUser(id);
        expect(user).not.toBeDefined();
    });
});


describe('store.addUser(id, name, room)', () => {
    it('should add a user to the game', () => {
        let id = '42';
        let name = 'Frodo';
        let room = 'B';
        let socket = {};
        let user = store.addUser(id, name, room, socket);
        let game = store.getGame(room);
        expect(game.players).toEqual(expect.arrayContaining([user]));
    });
});