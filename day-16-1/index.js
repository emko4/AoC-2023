console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const maze = data.toString().split('\n').map((line) => {
    return line.split('');
});

const step = (maze, checkMaze, direction, position) => {
    const currentPosition = { x: position.x + direction[0], y: position.y + direction[1] };

    if (currentPosition.x < 0 || currentPosition.x > maze.length - 1 || currentPosition.y < 0 || currentPosition.y > maze[0].length - 1) {
        return;
    }

    const currentNode = maze[currentPosition.x][currentPosition.y];

    if (checkMaze[currentPosition.x][currentPosition.y] === '#') {
        if (currentNode === '|' && (direction[1] === -1 || direction[1] === 1)) {
            return;
        }

        if (currentNode === '-' && (direction[0] === -1 || direction[0] === 1)) {
            return;
        }
    }

    checkMaze[currentPosition.x][currentPosition.y] = '#';

    if (currentNode === '.') {
        step(maze, checkMaze, direction, currentPosition);
    }

    if (currentNode === '|') {
        if (direction[1] === -1 || direction[1] === 1) {
            step(maze, checkMaze, [-1,0], currentPosition);
            step(maze, checkMaze, [1,0], currentPosition);
        }

        if (direction[1] === 0 && direction[1] === 0) {
            step(maze, checkMaze, direction, currentPosition);
        }
    }

    if (currentNode === '-'){
        if (direction[0] === -1 || direction[0] === 1) {
            step(maze, checkMaze, [0, -1], currentPosition);
            step(maze, checkMaze, [0, 1], currentPosition);
        }

        if (direction[0] === 0 && direction[0] === 0) {
            step(maze, checkMaze, direction, currentPosition);
        }
    }

    if (currentNode === '/') {
        if (direction[0] === 0 && direction[1] === 1) {
            step(maze, checkMaze, [-1,0], currentPosition);
        }

        if (direction[0] === 1 && direction[1] === 0) {
            step(maze, checkMaze, [0,-1], currentPosition);
        }

        if (direction[0] === 0 && direction[1] === -1) {
            step(maze, checkMaze, [1,0], currentPosition);
        }

        if (direction[0] === -1 && direction[1] === 0) {
            step(maze, checkMaze, [0,1], currentPosition);
        }
    }

    if (currentNode === '\\') {
        if (direction[0] === 0 && direction[1] === 1) {
            step(maze, checkMaze, [1,0], currentPosition);
        }

        if (direction[0] === -1 && direction[1] === 0) {
            step(maze, checkMaze, [0,-1], currentPosition);
        }

        if (direction[0] === 0 && direction[1] === -1) {
            step(maze, checkMaze, [-1,0], currentPosition);
        }

        if (direction[0] === 1 && direction[1] === 0) {
            step(maze, checkMaze, [0,1], currentPosition);
        }
    }
}

// default is top left node from left side
const energizeMaze = (maze, startPosition = { x: 0, y: -1 }, direction = [0,1]) => {
    const checkMaze = maze.map((line) => line.map(() => '.'));

    step(maze, checkMaze, direction, startPosition);

    return checkMaze.reduce((acc, line) => {
        return acc + (line.join('').match(/#/g) || []).length
    }, 0);
}

const result = energizeMaze(maze);

console.timeEnd('Runtime');
console.log('Result: ', result);