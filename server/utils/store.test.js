const expect = require('expect');

let {Store} = require('./store');
let {testGames} = require('./seed');

let store;
beforeEach(() => {
    store = new Store();
    store.games = testGames;
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
            role: 'R',
            ready: false,
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

describe('store.getGameByUser(id)', () => {
    it('should return the right game', () => {
        let id = '8';
        let game = store.getGameByUser(id);
        expect(game).toMatchObject(testGames[1]);
    });

    it('should return undefined', () => {
        let id = '101';
        let game = store.getGameByUser(id);
        expect(game).not.toBeDefined();
    });
});

describe('store.readyCheck(room)', () => {
    it('should return true', () => {
        let room = 'B';
        let ready = store.readyCheck(room);
        expect(ready).toBe(true);
    });

    it('should return false', () => {
        let room = 'A';
        let ready = store.readyCheck(room);
        expect(ready).toBe(false);
    });
});

describe('store.getSpies(room)', () => {
    it('should return the list of spies', () => {
        let room = 'B';
        let spies = store.getSpies(room);
        expect(spies.length).toBe(2);
        expect(spies).toMatchObject(expect.arrayContaining([{
            id: '10',
            name: 'Pippin',
            role: 'S',
            ready: true
        }, {
            id: '8',
            name: 'Gimli',
            role: 'S',
            ready: true
        }]));
    });
    it('should return the list of spies', () => {
        let room = 'C';
        let spies = store.getSpies(room);
        expect(spies.length).toBe(3);
        expect(spies).toMatchObject(expect.arrayContaining([{
            id: '12',
            name: 'Harry',
            role: 'S',
            ready: true
        }, {
            id: '13',
            name: 'Ron',
            role: 'S',
            ready: true
        }, {
            id: '15',
            name: 'Ginny',
            role: 'S',
            ready: true
        }]));
    });

});

describe('store.getResistance(room)', () => {
    it('should return the list of resistance', () => {
        let room = 'B';
        let resistance = store.getResistance(room);
        expect(resistance.length).toBe(4);
        expect(resistance).toMatchObject(expect.arrayContaining([{
            id: '11',
            name: 'Gandalf',
            role: 'R',
            ready: true
        }, {
            id: '9',
            name: 'Merry',
            role: 'R',
            ready: true
        }, {
            id: '6',
            name: 'Aragorn',
            role: 'R',
            ready: true
        }, {
            id: '7',
            name: 'Legolas',
            role: 'R',
            ready: true
        }]));
    });
    it('should return the list of resistance', () => {
        let room = 'C';
        let resistance = store.getResistance(room);
        expect(resistance.length).toBe(4);
        expect(resistance).toMatchObject(expect.arrayContaining([{
            id: '14',
            name: 'Hermione',
            role: 'R',
            ready: true
        }, {
            id: '16',
            name: 'Luna',
            role: 'R',
            ready: true
        }, {
            id: '17',
            name: 'Cho',
            role: 'R',
            ready: true
        }, {
            id: '18',
            name: 'Neville',
            role: 'R',
            ready: true
        }]));
    });
});

describe('store.initGame(room)', () => {
    it('should initialize the game', () => {
        let room = 'A';
        let game = store.initGame(room);
        let spies = store.getSpies(room);
        let resist = store.getResistance(room);
        expect(game.phase).toBe('mission-select');
        expect(spies.length).toBe(2);
        expect(resist.length).toBe(3);
        expect(game.leader).toBeLessThan(game.players.length);
    });
});

describe('store.nameInUse(name, room)', () => {
    it('should return true', () => {
        let name = 'Colin';
        let room = 'A';
        let check = store.nameInUse(name, room);
        expect(check).toBe(true);
    });
    it('should return false', () => {
        let name = 'Colin';
        let room = 'B';
        let check = store.nameInUse(name, room);
        expect(check).toBe(false);
    });
})

describe('store.removeUser(id)', () => {
    it('should not remove a user', () => {
        let id = '77';
        let user = store.removeUser(id);
        expect(store.games[0].players.length).toBe(5);
        expect(store.games[1].players.length).toBe(6);
        expect(store.games[2].players.length).toBe(7);
        expect(user).not.toBeDefined();
    });

    it('should remove the user', () => {
        let id = '17';
        let user = store.removeUser(id);
        expect(store.games[2]).not.toBe(expect.arrayContaining([{
            id: '17',
            name: 'Cho',
            role: 'R'
        }]));
        expect(store.games[2].players.length).toBe(6);
        expect(user).toBeDefined();
    });
});

describe('store.addUser(id, name, room)', () => {
    it('should add a user to the game', () => {
        let id = '42';
        let name = 'Frodo';
        let room = 'B';
        let user = store.addUser(id, name, room);
        let game = store.getGame(room);
        expect(game.players).toEqual(expect.arrayContaining([user]));
    });
});