console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const getDirection = (direction) => {
    switch (direction) {
        case '3': return [-1,0];
        case '0': return [0,1];
        case '1': return [1,0];
        case '2': return [0,-1];

        default: return null;
    }
}

const digPlan = data.toString().split('\n').map((order) => {
    const [, , color] = order.split(' ');

    const sanitizedColor = color.replace(/[()#]/g, '');

    const colorDirection = getDirection(sanitizedColor.slice(-1));
    const colorCount = parseInt(sanitizedColor.slice(0, 5), 16);

    return {
        direction: colorDirection,
        count: colorCount,
        color: sanitizedColor,
    };
});

const getAllNodes = (plan) => {
    let currentPosition = [0,0];
    const nodes = [];

    let nodesCount = 0;

    for (let i = 0; i < plan.length; i++) {
        const [directionX, directionY] = plan[i].direction;

        if (directionX === 0) {
            currentPosition = [currentPosition[0], currentPosition[1] + (directionY * plan[i].count)];
        }

        if (directionY === 0) {
            currentPosition = [currentPosition[0] + (directionX * plan[i].count), currentPosition[1]];
        }

        nodes.push(currentPosition);
        nodesCount += plan[i].count;
    }

    return { nodes, nodesCount };
}

const getInteriorSize = (plan) => {
    const { nodes, nodesCount } = getAllNodes(plan);

    let total = 0;

    for (let i = 0; i < nodes.length; i++) {
        const addX = nodes[i][0];
        const addY = nodes[i === nodes.length - 1 ? 0 : i + 1][1];
        const subX = nodes[i === nodes.length - 1 ? 0 : i + 1][0];
        const subY = nodes[i][1];

        total += (addX * addY * 0.5);
        total -= (subX * subY * 0.5);
    }

    return Math.abs(total) + Math.ceil(nodesCount / 2) + 1;
}

const result = getInteriorSize(digPlan);

console.timeEnd('Runtime');
console.log('Result: ', result);