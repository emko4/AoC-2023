const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n');
const matrix = lines.map((line) => {
    return line.split('');
})

const rowLength = lines[0].length;

const findStart = () => {
    const index = data.toString().replaceAll('\n', '').indexOf('S');
    return { x: Math.floor(index / rowLength), y: index % rowLength, type: 'S' };
};


const startNode = findStart();

console.log('Start: ', startNode);

const transitions = {
    'S': {
        '-1,0': ['7', '|', 'F'],
        '0,1': ['J', '-', '7'],
        '1,0': ['J', '|', 'L'],
        '0,-1': ['L', '-', 'F'],
    },
    '|': {
        '-1,0': ['7', '|', 'F', 'S'],
        '0,1': [],
        '1,0': ['J', '|', 'L', 'S'],
        '0,-1': [],
    },
    '-': {
        '-1,0': [],
        '0,1': ['J', '-', '7', 'S'],
        '1,0': [],
        '0,-1': ['L', '-', 'F', 'S'],
    },
    '7': {
        '-1,0': [],
        '0,1': [],
        '1,0': ['J', '|', 'L', 'S'],
        '0,-1': ['L', '-', 'F', 'S'],
    }
    ,
    'J': {
        '-1,0': ['7', '|', 'F', 'S'],
        '0,1': [],
        '1,0': [],
        '0,-1': ['L', '-', 'F', 'S'],
    }
    ,
    'L': {
        '-1,0': ['7', '|', 'F', 'S'],
        '0,1': ['J', '-', '7', 'S'],
        '1,0': [],
        '0,-1': [],
    }
    ,
    'F': {
        '-1,0': [],
        '0,1': ['J', '-', '7', 'S'],
        '1,0': ['J', '|', 'L', 'S'],
        '0,-1': [],
    }
}
const nextDirectionTable = {
    '-1,0': [[0, -1], [-1, 0], [0, 1]],
    '0,1': [[-1, 0], [0, 1], [1, 0]],
    '1,0': [[0, 1], [1, 0], [0, -1]],
    '0,-1': [[1, 0], [0, -1], [-1, 0]],
}

const isValidTransition = (originNodeType, newNodeType, direction) => {
    if (originNodeType === '.') return false;

    return !!transitions?.[originNodeType]?.[direction.join(',')]?.includes(newNodeType);
}

const getNextDirection = (nextNode, originDirection) => {
    const possibleDirections = nextDirectionTable[originDirection.join(',')];

    return possibleDirections.find((direction) => {
        const possibleType = matrix?.[nextNode.x + direction[0]]?.[nextNode.y + direction[1]];

        return isValidTransition(nextNode.type, possibleType, direction);
    });
}

const getPath = (direction, startNode) => {
    let currentDirection = direction;
    const path = [startNode];
    let isCompletePath = false;

    while (true) {
        const currentNode = path[path.length - 1];

        const nextNode = {
            x: currentNode.x + currentDirection[0],
            y: currentNode.y + currentDirection[1],
            type: matrix?.[currentNode.x + currentDirection[0]]?.[currentNode.y + currentDirection[1]],
        };

        if (nextNode.type === 'S') {
            isCompletePath = true;
            break;
        }

        if (nextNode.type === '.' || !isValidTransition(currentNode.type, nextNode.type, currentDirection)) {
            break;
        }

        const nextDirection = getNextDirection(nextNode, currentDirection);

        if (!nextDirection) {
            break;
        }

        currentDirection = nextDirection;
        path.push(nextNode);
    }

    return { path, isCompletePath };
}

// north, south, east and west paths from start node
const completePath = [[-1, 0], [0, 1], [1, 0], [0, -1]].map((direction) => {
    const { path, isCompletePath } = getPath(direction, startNode);

    if (!isCompletePath) return false;

    return { firstDirection: direction, path };
}).filter(Boolean)?.[0] || [{ path: [] }];

const result = completePath.path.length / 2;

console.log('Result: ', result);