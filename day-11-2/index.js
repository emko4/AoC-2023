console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n');
const matrix = lines.map((line) => {
    return line.split('');
});

const expandConstant = 1000000;

const emptyLines = matrix.reduce((acc, line, index) => {
    if (line.every((node) => node === '.')) {
        return [...acc, index];
    }

    return acc;
}, []);

const emptyColumns = matrix[0].reduce((acc, node, index) => {
    const indexColumn = matrix.map((line) => line[index]);

    if (indexColumn.every((node) => node === '.')) {
        return [...acc, index];
    }

    return acc;
}, []);

const galaxies = matrix.reduce((acc, line, x) => {
    const lineGalaxies = line.reduce((accLine, node, y) => {
        return node === '#' ? [...accLine, { x, y }] : accLine;
    }, []);

    return [...acc, ...lineGalaxies];
}, []);

const expandedGalaxies = galaxies.map((galaxy) => ({
    x: emptyLines.reduce((acc, columnIndex) => {
        return columnIndex < galaxy.x ? acc + (expandConstant - 1) : acc;
    }, galaxy.x),
    y: emptyColumns.reduce((acc, rowIndex) => {
        return rowIndex < galaxy.y ? acc + (expandConstant - 1) : acc;
    }, galaxy.y),
}));

const result = expandedGalaxies.reduce((acc, galaxy, index) => {
    const otherGalaxies = expandedGalaxies.slice(index + 1);

    const lengths = otherGalaxies.reduce((accOther, otherGalaxy) => {
        return accOther + Math.abs(otherGalaxy.x - galaxy.x) + Math.abs(otherGalaxy.y - galaxy.y);
    }, 0);

    return acc + lengths;
}, 0);

console.timeEnd('Runtime');

console.log('Result: ', result);