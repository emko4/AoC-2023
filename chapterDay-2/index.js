console.time('Runtime');

const LIMIT = 18000000000;

let creatures = [2, 0, 1, 1, 2, 2, 0, 0, 0, 0];
let creatureCount = creatures.reduce((acc, c) => acc + c, 0);
let seconds = 0;

while (creatureCount < LIMIT) {
    const spawn = creatures.pop();

    creatures = [spawn, ...creatures];
    creatures[3] += spawn;

    creatureCount = creatures.reduce((acc, c) => acc + c, 0);

    if (creatureCount <= LIMIT) {
        seconds += 1;
    }
}

console.timeEnd('Runtime');
console.log('Seconds: ', seconds);