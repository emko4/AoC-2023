const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n');

const getFirstNumber = (line) => {
    return line.match(/one|two|three|four|five|six|seven|eight|nine|\d/)?.[0]
        .replaceAll('one', '1')
        .replaceAll('two', '2')
        .replaceAll('three', '3')
        .replaceAll('four', '4')
        .replaceAll('five', '5')
        .replaceAll('six', '6')
        .replaceAll('seven', '7')
        .replaceAll('eight', '8')
        .replaceAll('nine', '9');
}

const getLastNumber = (line) => {
    let resultNumber = undefined;

    line.split('').reduceRight((acc, char) => {
        const currentSubtext = char + acc;

        const n = getFirstNumber(currentSubtext)
        if (!resultNumber && n) {
            resultNumber = n;
        }

        return currentSubtext;
    }, '')

    return resultNumber;
}

const numbers = lines.map((line, index) => {
    console.log(`${index}`.padStart(4, '0'), Number(`${getFirstNumber(line)}${getLastNumber(line)}`), line)
    return Number(`${getFirstNumber(line)}${getLastNumber(line)}`);
})

const result = numbers.reduce((acc, number) => acc += number, 0);

console.log(result)