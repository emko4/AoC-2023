console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const strings = data.toString().split(',');

const result = strings.reduce((acc, string) => {
    const result  = string.split('').reduce((accString, char) => {
        const ascii = char.charCodeAt(0);


        return ((accString + ascii) * 17) % 256;
    }, 0);

    return acc + result;
}, 0);

console.timeEnd('Runtime');
console.log('Result: ', result);