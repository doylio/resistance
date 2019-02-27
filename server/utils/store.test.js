const expect = require('expect');

let {Store} = require('./store');



// let testGames = [{
//     title: 'Rugby',
//     players: [{id: '1'}, {id: '3'}]
// }, {
//     title: 'Soccer',
//     players: [{id: '2'}]
// }]


describe('Store', () => {
    let store;
    
    beforeEach(() => {
        let testUsers = [{
            id: '1',
            name: "Colin",
            room: "Rugby"
        }, {
            id: '2',
            name: "Eric",
            room: "Soccer"
        }, {
            id: '3',
            name: "Devin",
            room: "Rugby"
        }];
        store = new Store();
        store.users = testUsers;
    });

    it('should add new user', () => {
        let newUser = {
            id: '1232',
            name: "R2D2",
            room: "Dagoba"
        };
        store.addUser(newUser.id, newUser.name, newUser.room);
        expect(store.users.length).toBe(4);
        expect(store.users.reverse()[0]).toMatchObject(newUser);
    });
    it('should return names for the rugby room', () => {
        let userList = store.getUserList('Rugby');
        expect(userList).toMatchObject(['Colin', 'Devin']);
    });
    it('should return names for the soccer room', () => {
        let userList = store.getUserList('Soccer');
        expect(userList).toMatchObject(['Eric']);
    });
    it('should remove a user', () => {
        let id = '1';
        let removedUser = store.removeUser(id);
        console.log(store.users);
        expect(store.users.length).toBe(2);
        expect(store.users).not.toMatchObject(removedUser);
    });
    it('should not remove user', () => {
        let id = '133';
        store.removeUser(id);
        expect(store.users.length).toBe(3);
        expect(store.users).toMatchObject([{
            id: '1',
            name: "Colin",
            room: "Rugby"
        }, {
            id: '2',
            name: "Eric",
            room: "Soccer"
        }, {
            id: '3',
            name: "Devin",
            room: "Rugby"
        }]);
    });
    it('should find user', () => {
        let id = '2';
        let foundUser = store.getUser(id);
        expect(foundUser).toMatchObject({
            id: '2',
            name: "Eric",
            room: "Soccer"
        });
    });
    it('should not find user', () => {
        let id = '222';
        let foundUser = store.getUser(id);
        expect(foundUser).not.toBeDefined();
    });
    
});