const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const [stepsText, mapText] = data.toString().split('\n\n');

const steps = stepsText.split('');

const map = mapText.split('\n').reduce((acc, line) => {
    const [node, next] = line.split(' = ');
    const [left, right] = next.replace(/[\(\)]/g, '').split(', ');

    return { ...acc, [node]: { L: left, R: right }};
}, {});

console.log('Steps:', steps);
console.log("Map:\n", map);

let stepCount = 0;
let currentIndex = 0;
let currentStep = 'AAA';

while (currentStep !== 'ZZZ') {
    const direction = steps[currentIndex];

    console.log('From ', currentStep, ' to ', map[currentStep][direction]);
    currentStep = map[currentStep][direction];

    stepCount += 1;
    currentIndex = currentIndex === steps.length - 1 ? 0 : currentIndex + 1;
}

console.log('Result: ', stepCount);