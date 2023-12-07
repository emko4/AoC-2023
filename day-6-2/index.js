const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n').map((line) => {
    return [line.split(": ")[1].trim().replace(/\s+/g, '')].map(Number);
});

const races = lines[0].map((time, index) => {
    return { time, distance: lines[1][index] };
});

console.log('Races: ', races);

const winCounts = races.map((race) => {
    let winCount = 0;

    for(let speed = 0; speed < race.time; speed++) {
        const distance = speed * (race.time - speed);
        if (distance > race.distance) {
            winCount += 1;
        }
    }

    return winCount;
})

console.log('Race win counts: ', winCounts);

const result = winCounts.reduce((acc, winCount) => {
    return acc * winCount;
}, 1);

console.log('Result: ', result);