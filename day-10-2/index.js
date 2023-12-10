const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n');
const matrix = lines.map((line) => {
    return line.split('');
})

const rowLength = lines[0].length;

const findStart = () => {
    const index = data.toString().replaceAll('\n', '').indexOf('S');

    return {
        x: Math.floor(index / rowLength),
        y: index % rowLength,
        type: 'S',

    };
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

const isPathNode = (node) => {
    return !!completePath.path.find((pathNode) => pathNode.x === node.x && pathNode.y === node.y);
}

const sanitizedMatrix = matrix.map((line, x) => {
    return line.map((type, y) => {
        const node = { x, y };

        if (!isPathNode(node)) {
            return '.';
        }

        return type;
    });
});

const getIntersections = (subPath) => {
    let lastIntersection = undefined;

    return subPath.reduce((acc, n) => {
        if (lastIntersection === 'F') {
            if (n === '7') {
                lastIntersection = undefined;
                return acc + 1;
            }

            if (n === 'J') {
                lastIntersection = undefined;
            }

            return acc;
        }

        if (lastIntersection === 'L') {
            if (n === 'J') {
                lastIntersection = undefined;
                return acc + 1;
            }

            if (n === '7') {
                lastIntersection = undefined;
            }

            return acc;
        }

        if (n === '|') {
            return acc + 1;
        }

        if (n === 'F' || n === 'L') {
            lastIntersection = n;
            return acc + 1;
        }

        return acc;
    }, 0);
}

const isNodeInsidePath = (node) => {
    if (isPathNode(node)) return false;

    const { x, y } = node;

    const leftIntersections = getIntersections(sanitizedMatrix[x].slice(0, y));
    const rightIntersections = getIntersections(sanitizedMatrix[x].slice(y + 1, sanitizedMatrix[x].length));

    return leftIntersections % 2 === 1 && rightIntersections % 2 === 1;
};

const result = sanitizedMatrix.reduce((accMatrix, line, x) => {
    const insideNodes = line.reduce((accLine, node, y) => {
        const currentNode = { x, y };

        return isNodeInsidePath(currentNode) ? accLine + 1 : accLine;
    }, 0);

    return accMatrix + insideNodes;
}, 0);

console.log('Result: ', result);