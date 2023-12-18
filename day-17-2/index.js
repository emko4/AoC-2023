console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const originMap = data.toString().split('\n').map((line) => {
    return line.split('').map(Number);
});

const isStartNode = (x, y) => {
    return x === 0 && y === 0;
}

const getHeat = (map) => {
    // start at the left top corner
    const queue = [{ heat: 0, x: 0, y: 0, directionX: 0, directionY: 0, steps: 0 }];

    const visited = new Set();

    while (queue.length) {
        const { heat, x, y, directionX, directionY, steps } = queue.sort(({ heat: heatA }, { heat: heatB }) => heatB - heatA).pop();

        // end of map
        if (x === map.length - 1 && y === map[0].length - 1 && steps >= 4) {
            return heat;
        }

        const hash = `${x},${y},${directionX},${directionY},${steps}`;

        if (visited.has(hash)) {
            continue;
        }

        visited.add(hash);

        // can continue same direction for 10 moves
        if (steps < 10 && !isStartNode(x, y)) {
            const nextX = x + directionX;
            const nextY = y + directionY;

            if (nextX >= 0 && nextX < map.length && nextY >= 0 && nextY < map[0].length) {
                queue.push({ heat: heat + map[nextX][nextY], x: nextX, y: nextY, directionX, directionY, steps: steps + 1 })
            }
        }

        // can change direction after 4 same direction moves
        if (steps >= 4 || isStartNode(x, y)) {
            [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([nextDirectionX, nextDirectionY]) => {
                // not same or reverse direction
                if (!((nextDirectionX === directionX && nextDirectionY === directionY) || (nextDirectionX === -directionX && nextDirectionY === -directionY))) {
                    const nextX = x + nextDirectionX;
                    const nextY = y + nextDirectionY;

                    if (nextX >= 0 && nextX < map.length && nextY >= 0 && nextY < map[0].length) {
                        queue.push({ heat: heat + map[nextX][nextY], x: nextX, y: nextY, directionX: nextDirectionX, directionY: nextDirectionY, steps: 1 });
                    }
                }
            });
        }

    }

    return 0;
}

const result = getHeat(originMap);

console.timeEnd('Runtime');
console.log('Result: ', result);