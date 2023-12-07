const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const matrix = data.toString().split('\n');

const rowLength = matrix[0].length;

const checkSymbol = (number, rowIndex, position) => {
    const topBorder = matrix[rowIndex - 1]?.substring(position - 1, position + number.length + 1);
    const leftCharacter = matrix[rowIndex][position - 1];
    const bottomBorder = matrix[rowIndex + 1]?.substring(position - 1, position + number.length + 1);
    const rightCharacter = matrix[rowIndex][position + number.length];

    const wholeBorder = (topBorder || '') + (leftCharacter || '') + (bottomBorder || '') + (rightCharacter || '');

    console.log('Border: ', wholeBorder);

    if (wholeBorder.replaceAll('.', '').length > 0) {
        return Number(number);
    }

    return 0;
}

const regex = /\d+/g;

let result = 0;

while ((match = regex.exec(matrix.join(''))) != null) {
    const number = match[0];
    const rowIndex = Math.floor(match.index / rowLength);
    const position = match.index % rowLength;

    console.log("Match " + number + " found at row " + rowIndex + " position " + position);

    result += checkSymbol(number, rowIndex, position);
}

console.log('Result: ', result);