const expect = require('expect');

let {generateMessage, generateSpyList, generateList} = require('./message');

describe('generateMessage(from, text)', () => {
    it('should generate the correct message object', () => {
        let from = "Luke Skywalker";
        let text = "That's not true.  That's impossible!";
        let message = generateMessage(from, text);
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, text});
    });
});

describe('generateSpyList(arr, recipient)', () => {
    it('should generate the correct spy list', () => {
        let spies = [{
            id: '1',
            name: 'Shawn',
            role: 'spy'
        }, {
            id: '2',
            name: 'Colin',
            role: 'spy'
        }, {
            id: '3',
            name: 'Devin',
            role: 'spy'
        }]
        let user = spies[1];
        let string = generateSpyList(spies, user);
        expect(typeof string).toBe('string');
        expect(string).toBe('Devin and Shawn');
    });
    it('should generate the correct spy list', () => {
        let spies = [{
            id: '1',
            name: 'Shawn',
            role: 'spy'
        }, {
            id: '2',
            name: 'Colin',
            role: 'spy'
        }, {
            id: '3',
            name: 'Devin',
            role: 'spy'
        }, {
            id: '4',
            name: 'Eric',
            role: 'spy'
        }]
        let user = spies[1];
        let string = generateSpyList(spies, user);
        expect(typeof string).toBe('string');
        expect(string).toBe('Eric, Devin and Shawn');
    });
});

describe('generateList(arr)', () => {
    it('should return the correct list', () => {
        let list = ['Moe', 'Curly', 'Larry'];
        let result = generateList(list);
        expect(result).toBe('Larry, Curly and Moe');
    });
    it('should return the correct list', () => {
        let list = ['Costello', 'Abbott'];
        let result = generateList(list);
        expect(result).toBe('Abbott and Costello');
    });
});