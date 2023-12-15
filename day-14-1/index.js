console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const map = data.toString().split('\n').map((line) => {
    return line.split('');
});

const getNewPosition = (column, fromIndex) => {
    let currentIndex = fromIndex - 1;
    while (column[currentIndex] !== '#' && column[currentIndex] !== 'O' && currentIndex >= 0) {
        currentIndex -= 1;
    }

    return currentIndex + 1;
}

const processColumn = (index) => {
    const column = map.map((line) => line[index]);

    const tiltedColumn = column.reduce((acc, char, i) => {
        if (char === 'O') {
            const newIndex = getNewPosition(acc, i);

            acc[i] = '.';
            acc[newIndex] = 'O';
        }

        return acc;
    }, column);

    return tiltedColumn.reduce((acc, char, i) => {
        if (char === 'O') return acc + tiltedColumn.length - i;

        return acc;
    }, 0);
}

const result = map[0].reduce((acc, char, index) => {
    const load = processColumn(index);

    return acc + load;
}, 0);

console.timeEnd('Runtime');
console.log('Result: ', result);