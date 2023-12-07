const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const games = data.toString().split('\n');

const getMinimumConfiguration = (separatedRounds) => {
    return separatedRounds.reduce((acc, round) => {
        return {
            blue: round.blue > acc.blue ? round.blue : acc.blue,
            green: round.green > acc.green ? round.green : acc.green,
            red: round.red > acc.red ? round.red : acc.red,
        }
    }, { blue: 0, green: 0, red: 0 });
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

    const min = getMinimumConfiguration(separatedRounds)

    const power = min.blue * min.green * min.red;

    console.log('[DEV]',id, separatedRounds, power, min);

    return acc + power;
}, 0);

console.log('Result: ', result);