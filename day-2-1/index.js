const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const games = data.toString().split('\n');

const MAX = {
    blue: 14,
    green: 13,
    red: 12,
};

const isPossibleCheck = (round) => {
    if (round.blue > MAX.blue || round.green > MAX.green || round.red > MAX.red) {
        return false;
    }

    return true;
};

const result = games.reduce((acc, game) => {
    const [idText, rounds] = game.split(':')

    const separatedRounds = rounds.split(';').map((round) => {
        const cubes = round.trim().split(',');

        return cubes.reduce((a, cube) => {
            const [count, color] = cube.trim().split(' ');

            return { ...a, [color]: Number(count)};
        }, {})
    });

    const id = Number(idText.replace(/[^\d]/g, ''));

    const isPossible = separatedRounds.every(isPossibleCheck);

    console.log('[DEV]',id, separatedRounds, isPossible);

    return isPossible ? acc + id : acc;
}, 0);

console.log('Result: ', result);