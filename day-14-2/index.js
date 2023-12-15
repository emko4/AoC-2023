console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const map = data.toString().split('\n').map((line) => {
    return line.split('');
});

const processNorthTilt = (map) => {
    for (let i = 0; i < map[0].length; i++) {
        const column = map.map((line) => line[i]);

        const tiltedColumn = column.reduce((acc, char, index) => {
            if (char === 'O') {
                let newIndex = index - 1;

                while (acc[newIndex] !== '#' && acc[newIndex] !== 'O' && newIndex >= 0) {
                    newIndex -= 1;
                }

                acc[index] = '.';
                acc[newIndex + 1] = 'O';
            }

            return acc;
        }, column);

        tiltedColumn.forEach((char, j) => { map[j][i] = char });
    }

    return map;
}

const processWestTilt = (map) => {
    for (let i = 0; i < map.length; i++) {
        const line = map[i];

        const tiltedLine = line.reduce((acc, char, index) => {
            if (char === 'O') {
                let newIndex = index - 1;

                while (acc[newIndex] !== '#' && acc[newIndex] !== 'O' && newIndex >= 0) {
                    newIndex -= 1;
                }

                acc[index] = '.';
                acc[newIndex + 1] = 'O';
            }

            return acc;
        }, line);

        map[i] = tiltedLine;
    }

    return map;
}

const processSouthTilt = (map) => {
    for (let i = 0; i < map[0].length; i++) {
        const column = map.map((line) => line[i]);

        const tiltedColumn = column.reduceRight((acc, char, index) => {
            if (char === 'O') {
                let newIndex = index + 1;

                while (acc[newIndex] !== '#' && acc[newIndex] !== 'O' && newIndex < column.length) {
                    newIndex += 1;
                }

                acc[index] = '.';
                acc[newIndex - 1] = 'O';
            }

            return acc;
        }, column);

        tiltedColumn.forEach((char, j) => { map[j][i] = char });
    }

    return map;
}

const processEastTilt = (map) => {
    for (let i = 0; i < map.length; i++) {
        const line = map[i];

        const tiltedLine = line.reduceRight((acc, char, index) => {
            if (char === 'O') {
                let newIndex = index + 1;

                while (acc[newIndex] !== '#' && acc[newIndex] !== 'O' && newIndex < line.length) {
                    newIndex += 1;
                }

                acc[index] = '.';
                acc[newIndex - 1] = 'O';
            }

            return acc;
        }, line);

        map[i] = tiltedLine;
    }

    return map;
}


const processTilt = (map, direction) => {
    switch (direction) {
        case 'N': return processNorthTilt(map);
        case 'W': return processWestTilt(map);
        case 'S': return processSouthTilt(map);
        case 'E': return processEastTilt(map);
        default: return map;
    }
}

const processCycle = (map) => {
    const directions = ['N', 'W', 'S', 'E'];

    return directions.reduce((acc, direction, ) => {
        return processTilt(acc, direction);
    }, map);
}

const getLoad = (map) => {
    return map.reduce((acc, line, index) => {
        const lineLoad = line.reduce((accLine, char) => {
            if (char === 'O') {
                return accLine + map.length - index;
            }

            return accLine;
        }, 0);

        return acc + lineLoad;
    }, 0);
}

const getMapHash = (map) => map.map((l) => l.join('')).join('');

const getProcessedMap = (map, cycles) => {
    let result = map
    const lineLength = map[0].length;
    const mapHashes = { [getMapHash(result)]: { load: getLoad(result), cycle: 0 } }

    for (let i = 1; i < cycles; i++) {
        result = processCycle(result);

        const hash = result.map((l) => l.join('')).join('');

        if (!mapHashes[hash]) {
            mapHashes[hash] = { load: getLoad(result), cycle: i };
        } else {
            const hit = mapHashes[hash];

            const repetitionLength = i - hit.cycle;
            const resultCycle = ((cycles - hit.cycle) % repetitionLength) + hit.cycle;
            const resultHash = Object.keys(mapHashes).find((h) => mapHashes[h].cycle === resultCycle);

            const splitRegex = new RegExp(`.{1,${lineLength}}`, 'g');

            return (resultHash.match(splitRegex) || []).map((l) => l.split(''))
        }

    }

    return result;
}

const copyMap = map.map((line) => line.map(c => c));

const processedMap = getProcessedMap(copyMap, 1000000000);

const result = getLoad(processedMap);

console.timeEnd('Runtime');
console.log('Result: ', result);