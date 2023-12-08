const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const [stepsText, mapText] = data.toString().split('\n\n');

const steps = stepsText.split('');

const map = mapText.split('\n').reduce((acc, line) => {
    const [node, next] = line.split(' = ');
    const [left, right] = next.replace(/[\(\)]/g, '').split(', ');

    return { ...acc, [node]: { L: left, R: right }};
}, {});

const startNodes = Object.keys(map).filter((node) => node[2] === 'A');

console.log('Start nodes: ', startNodes);
console.log('Steps:', steps);
console.log("Map:\n", map);

const allPathsLength = startNodes.map((node) => {
    const endNodes = [];

    let stepCount = 0;
    let currentIndex = 0;
    let currentStep = node;

    const pathLengths = [];

    while (currentStep[2] !== 'Z' && !endNodes.includes(currentStep)) {
        const direction = steps[currentIndex];

        currentStep = map[currentStep][direction];

        stepCount += 1;
        currentIndex = currentIndex === steps.length - 1 ? 0 : currentIndex + 1;

        if (currentStep[2] === 'Z') {
            pathLengths.push(stepCount);
            endNodes.push(currentStep);
        }
    }

    return pathLengths;
}).flat();

const gcd = (a, b) => a ? gcd(b % a, a) : b;

const lcm = (a, b) => a * b / gcd(a, b);

const result = allPathsLength.reduce(lcm);

console.log('Result: ', result);