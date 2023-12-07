const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n');

const numbers = lines.map((line) => {
    const number =  line.replace(/[^\d]/g, '');

    return Number(`${number[0]}${number[number.length - 1]}`);
})

const result = numbers.reduce((acc, number) => acc += number, 0);

console.log(result)