console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const getDirection = (direction) => {
    switch (direction) {
        case 'U': return [-1,0];
        case 'R': return [0,1];
        case 'D': return [1,0];
        case 'L': return [0,-1];
        default: return null;
    }
}

const digPlan = data.toString().split('\n').map((order) => {
    const [direction, count, color] = order.split(' ');

    return {
        direction: getDirection(direction),
        count: Number(count),
        color: color.replace(/[()#]/g, ''),
    };
});

const getAllNodes = (plan) => {
    let currentPosition = { x: 0, y: 0 };
    const allNodes = new Set();
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    const hashMapX = {  0: [0] };
    const hashMapY = { 0: [0] };

    const hashConnections = { '0,0': {} };

    allNodes.add(`${currentPosition.x},${currentPosition.y}`);
    plan.forEach(({ direction, count, color }) => {
        const [directionX, directionY] = direction;

        for (let i = 0; i < count; i++) {
            const beforePosition = { x: currentPosition.x, y: currentPosition.y };

            if (directionX === 0) {
                currentPosition = { x: currentPosition.x, y: currentPosition.y + directionY };

                allNodes.add(`${currentPosition.x},${currentPosition.y}`);
            }

            if (directionY === 0) {
                currentPosition = { x: currentPosition.x + directionX, y: currentPosition.y };

                allNodes.add(`${currentPosition.x},${currentPosition.y}`);
            }

            hashConnections[`${currentPosition.x},${currentPosition.y}`] = {
                before: `${beforePosition.x},${beforePosition.y}`,
                neighbors: [`${beforePosition.x},${beforePosition.y}`],
            }

            if (currentPosition.x < minX) minX = currentPosition.x;
            if (currentPosition.x > maxX) maxX = currentPosition.x;
            if (currentPosition.y < minY) minY = currentPosition.y;
            if (currentPosition.y > maxY) maxY = currentPosition.y;

            hashMapX[currentPosition.x] = [...new Set([...(hashMapX[currentPosition.x] || []), currentPosition.y])].sort((a, b) => a - b);
            hashMapY[currentPosition.y] = [...new Set([...(hashMapY[currentPosition.y] || []), currentPosition.x])].sort((a, b) => a - b);
        }
    });

    Object.keys(hashConnections).forEach((key, index, array) => {
        if (index === array.length - 1) {
            hashConnections[array[0]] = {...hashConnections[array[0]], before: key, neighbors: [...hashConnections[array[0]].neighbors || [], key] }
            hashConnections[key] = {...hashConnections[key], after: array[0], neighbors: [...hashConnections[key].neighbors || [], array[0]] }
        } else {
            hashConnections[key] = {...hashConnections[key], after: array[index + 1], neighbors: [...hashConnections[key].neighbors || [], array[index + 1]] }
        }
    });

    return { allNodes, hashMapX, hashMapY, hashConnections, minX, maxX: maxX + 1, minY, maxY: maxY + 1 };
}

// for edge node return false
const isInside = (x, y, minX, minY, allNodes, hashMapX, hashMapY, connections) => {
    if (allNodes.has(`${x},${y}`)) {
        return false;
    }

    let intervalStart = -Infinity;

    let xLeftIntersectionsCount = 0;
    let xRightIntersectionsCount = 0;
    for (let i = 0; i < hashMapX[x].length; i++) {
        // start of interval
        if (intervalStart < minY) {
            intervalStart = hashMapX[x][i];
        }

        // end of interval
        if (intervalStart >= minY && !connections[`${x},${hashMapX[x][i]}`].neighbors.includes(`${x},${hashMapX[x][i + 1]}`)) {
            const intervalEnd = hashMapX[x][i];

            if (intervalStart !== intervalEnd && (
                (
                    allNodes.has(`${x - 1},${intervalStart}`) &&
                    connections[`${x},${intervalStart}`].neighbors.includes(`${x - 1},${intervalStart}`) &&
                    allNodes.has(`${x - 1},${intervalEnd}`) &&
                    connections[`${x},${intervalEnd}`].neighbors.includes(`${x - 1},${intervalEnd}`)
                ) ||
                (
                    allNodes.has(`${x + 1},${intervalStart}`) &&
                    connections[`${x},${intervalStart}`].neighbors.includes(`${x + 1},${intervalStart}`) &&
                    allNodes.has(`${x + 1},${intervalEnd}`) &&
                    connections[`${x},${intervalEnd}`].neighbors.includes(`${x + 1},${intervalEnd}`))
            )) {
                (intervalEnd < y) ? xLeftIntersectionsCount += 2 : xRightIntersectionsCount += 2;
            } else {
                (intervalEnd < y) ? xLeftIntersectionsCount += 1 : xRightIntersectionsCount += 1;
            }

            intervalStart = -Infinity;
        }
    }

    let xTopIntersectionsCount = 0;
    let xBottomIntersectionsCount = 0;
    for (let i = 0; i < hashMapY[y].length; i++) {
        // start of interval
        if (intervalStart < minX) {
            intervalStart = hashMapY[y][i];
        }

        // end of interval
        if (intervalStart >= minX && !connections[`${hashMapY[y][i]},${y}`].neighbors.includes(`${hashMapY[y][i + 1]},${y}`)) {
            const intervalEnd = hashMapY[y][i];

            if (intervalStart !== intervalEnd && (
                (
                    allNodes.has(`${intervalStart},${y - 1}`) &&
                    connections[`${intervalStart},${y}`].neighbors.includes(`${intervalStart},${y - 1}`) &&
                    allNodes.has(`${intervalEnd},${y - 1}`) &&
                    connections[`${intervalEnd},${y}`].neighbors.includes(`${intervalEnd},${y - 1}`)
                ) ||
                (
                    allNodes.has(`${intervalStart},${y + 1}`) &&
                    connections[`${intervalStart},${y}`].neighbors.includes(`${intervalStart},${y + 1}`) &&
                    allNodes.has(`${intervalEnd},${y + 1}`) &&
                    connections[`${intervalEnd},${y}`].neighbors.includes(`${intervalEnd},${y + 1}`)
                )
            )) {
                (intervalEnd < x) ? xTopIntersectionsCount += 2 : xBottomIntersectionsCount += 2;
            } else {
                (intervalEnd < x) ? xTopIntersectionsCount += 1 : xBottomIntersectionsCount += 1;
            }

            intervalStart = -Infinity;
        }
    }

    // all intersection counts are odd
    return xLeftIntersectionsCount % 2 === 1 && xRightIntersectionsCount % 2 === 1 && xTopIntersectionsCount % 2 === 1 && xBottomIntersectionsCount % 2 === 1;
}

const getInteriorSize = (plan) => {
    const { allNodes: nodes, hashMapX, hashMapY, hashConnections, minX, maxX, minY, maxY } = getAllNodes(plan);

    const edgeCount = nodes.size;
    let insideCount = 0;

    for (let i = minX; i < maxX; i++) {
        for (let j = minY; j < maxY; j++) {
            if (isInside(i, j, minX, minY, nodes, hashMapX, hashMapY, hashConnections)) {
                insideCount += 1;
            }
        }
    }

    return edgeCount + insideCount;
}

const result = getInteriorSize(digPlan);

console.timeEnd('Runtime');
console.log('Result: ', result);