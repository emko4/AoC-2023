const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const matrix = data.toString().split('\n');

const rowLength = matrix[0].length;

const regexAsterix = /\*/g;
const asterixes = [];
while ((match = regexAsterix.exec(matrix.join(''))) != null) {
    const rowIndex = Math.floor(match.index / rowLength);
    const position = match.index % rowLength;

    asterixes.push({ rowIndex, position, numbers: [] });
}

const regexNumber = /\d+/g;
while ((match = regexNumber.exec(matrix.join(''))) != null) {
    const number = match[0];
    const rowIndex = Math.floor(match.index / rowLength);
    const position = match.index % rowLength;

    console.log("Match " + number + " found at row " + rowIndex + " position " + position);


    asterixes.forEach((asterix) => {
        const isInTopBorder = asterix.rowIndex === rowIndex - 1 && asterix.position >= position - 1 && asterix.position < position + number.length + 1;
        const isLeftCharacter = asterix.rowIndex === rowIndex && asterix.position === position - 1;
        const isInBottomBorder = asterix.rowIndex === rowIndex + 1 && asterix.position >= position - 1 && asterix.position < position + number.length + 1;
        const isRightCharacter = asterix.rowIndex === rowIndex && asterix.position === position + number.length;

        if (isInTopBorder || isLeftCharacter || isInBottomBorder || isRightCharacter) {
            asterix.numbers.push(number);
        }
    })
}

console.log(asterixes);

const result = asterixes.reduce((acc, asterix) => {
    if (asterix.numbers.length > 1) {
        return acc + (Number(asterix.numbers[0]) * Number(asterix.numbers[1]));
    }

    return acc;
}, 0);

console.log('Result: ', result);