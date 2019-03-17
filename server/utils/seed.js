let testGames = [{
    room: 'A',
    players: [{
        id: '1',
        name: 'Shawn',
        role: 'r',
        action: 'ready'
    }, {
        id: '2',
        name: 'Colin',
        role: 'r',
        action: null,
    }, {
        id: '3',
        name: 'Eric',
        role: 'r',
        action: null,
    }, {
        id: '4',
        name: 'Devin',
        role: 'r',
        action: null,
    }, {
        id: '5',
        name: 'Cameron',
        role: 'r',
        action: null
    }],
    score: [0, 0],
    leader: 0,
    team: [],
    yesVotes: [],
    noVotes: [],
    missionResults: [],
    missionNumber: 0,
}, {
    room: 'B',
    players: [{
        id: '6',
        name: 'Aragorn',
        role: 'r',
        action: null
    }, {
        id: '7',
        name: 'Legolas',
        role: 'r',
        action: null
    }, {
        id: '8',
        name: 'Gimli',
        role: 's',
        action: null
    }, {
        id: '9',
        name: 'Merry',
        role: 'r',
        action: null
    }, {
        id: '10',
        name: 'Pippin',
        role: 's',
        action: null
    }, {
        id: '11',
        name: 'Gandalf',
        role: 'r',
        action: null
    }],
    score: [0, 0],
    leader: 3,
    team: [],
    yesVotes: [],
    noVotes: [],
    missionResults: [3, 1],
    missionNumber: 2,
}, {
    room: 'C',
    players: [{
        id: '12',
        name: 'Harry',
        role: 's',
        action: 'vote'
    }, {
        id: '13',
        name: 'Ron',
        role: 's',
        action: 'vote'
    }, {
        id: '14',
        name: 'Hermione',
        role: 'r',
        action: 'vote'
    }, {
        id: '15',
        name: 'Ginny',
        role: 's',
        action: 'vote'
    }, {
        id: '16',
        name: 'Luna',
        role: 'r',
        action: 'vote'
    }, {
        id: '17',
        name: 'Cho',
        role: 'r',
        action: 'vote'
    }, {
        id: '18',
        name: 'Neville',
        role: 'r',
        action: 'vote'
    }],
    score: [1, 0],
    leader: 3,
    team: [{
        id: '12',
        name: 'Harry',
        role: 's',
        action: 'vote'
    }, {
        id: '13',
        name: 'Ron',
        role: 's',
        action: 'vote'
    }, {
        id: '14',
        name: 'Hermione',
        role: 'r',
        action: 'vote'
    }],
    yesVotes: [],
    noVotes: [],
    missionResults: [],
    missionNumber: 1,
}];

let testPlayers = [];
testGames.forEach(game => {
    testPlayers = testPlayers.concat(game.players);
});

module.exports = {testGames, testPlayers};