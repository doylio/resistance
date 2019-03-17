const expect = require('expect');
let {doubleMission, missionSize} = require('./missionSize');

describe('missionSize()', () => {
    it('should return the correct mission size', () => {
        let numberOfPlayers = 7;
        let missionNumber = 2;
        let result = missionSize(numberOfPlayers, missionNumber);
        expect(result).toBe(3);
    });
    it('should return the correct mission size', () => {
        let numberOfPlayers = 10;
        let missionNumber = 1;
        let result = missionSize(numberOfPlayers, missionNumber);
        expect(result).toBe(4);
    });
    it('should return the correct mission size', () => {
        let numberOfPlayers = 5;
        let missionNumber = 2;
        let result = missionSize(numberOfPlayers, missionNumber);
        expect(result).toBe(2);
    });
    it('should return the correct mission size', () => {
        let numberOfPlayers = 6;
        let missionNumber = 4;
        let result = missionSize(numberOfPlayers, missionNumber);
        expect(result).toBe(4);
    });
});

describe('doubleMission()', () => {
    it('should return false', () => {
        let numberOfPlayers = 6;
        let missionNumber = 4;
        let result = doubleMission(numberOfPlayers, missionNumber);
        expect(result).toBe(false);
    });
    it('should return false', () => {
        let numberOfPlayers = 8;
        let missionNumber = 1;
        let result = doubleMission(numberOfPlayers, missionNumber);
        expect(result).toBe(false);
    });
    it('should return false', () => {
        let numberOfPlayers = 9;
        let missionNumber = 0;
        let result = doubleMission(numberOfPlayers, missionNumber);
        expect(result).toBe(false);
    });
    it('should return true', () => {
        let numberOfPlayers = 8;
        let missionNumber = 3;
        let result = doubleMission(numberOfPlayers, missionNumber);
        expect(result).toBe(true);
    });
    it('should return true', () => {
        let numberOfPlayers = 10;
        let missionNumber = 3;
        let result = doubleMission(numberOfPlayers, missionNumber);
        expect(result).toBe(true);
    });
})