const missionSize = (numberOfPlayers, missionNumber) => {
    let table = [];
    table[5] = [2, 3, 2, 3, 3];
    table[6] = [2, 3, 4, 3, 4];
    table[7] = [2, 3, 3, 4, 4];
    table[8] = [3, 4, 4, 5, 5];
    table[9] = [3, 4, 4, 5, 5];
    table[10] = [3, 4, 4, 5, 5];

    return table[numberOfPlayers][missionNumber];
}

module.exports = {missionSize};