console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const mazeStructure = data.toString().split('\n').map((line) => line.split(''));

function shortestPath(maze) {
    const rows = maze.length;
    const cols = maze[0].length;

    // Define the starting and ending points
    let start = null;
    let end = null;

    // Find the starting and ending points
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (maze[i][j] === "A") {
                start = [i, j];
            } else if (maze[i][j] === "B") {
                end = [i, j];
            }
        }
    }

    // Define the directions (up, down, left, right)
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    // Perform BFS to find the shortest path
    const queue = [[start, []]];
    const visited = new Set();

    let count = 0;
    while (queue.length > 0 && count < 5) {
        const [[x, y], path] = queue.shift();

        // If reached the end point, return the path
        if (x === end[0]&& y === end[1]) {
            return path;
        }

        // Explore neighboring cells
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            // Check if the new position is valid and not visited
            if (['.', 'B'].includes(maze[newX][newY]) && !visited.has(`${newX},${newY}`)) {
                visited.add(`${newX},${newY}`);
                // console.log(visited);
                queue.push([
                    [newX, newY],
                    [...path, [newX, newY]],
                ]);
            }
        }
    }

    // If no path found, return null
    return null;
}

const path = shortestPath(mazeStructure) || [];

path.slice(0, -1).forEach(([x, y]) => {
    mazeStructure[x][y] = 'x';
});

const output = mazeStructure.map((line) => line.join('')).join('\n');

const html = `<html style="font-family: monospace;"><body>${output}</body></html>`;

fs.writeFileSync(__dirname + '/output.html', html);

console.timeEnd('Runtime');