console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const strings = data.toString().split(',');

const boxesCount = 256;

const getBoxNumber = (label) => {
    return label.split('').reduce((acc, char) => {
        const ascii = char.charCodeAt(0);
        return ((acc + ascii) * 17) % boxesCount;
    }, 0);
}

const setupBoxes = () => {
    const boxes = Array(boxesCount).fill().map(() => ({}));
    const table = {};

    strings.forEach((string) => {
        const label = string.match(/^\w+/)[0];
        const operation = string.match(/-|=/)[0];
        const focus = string.match(/\d*$/)[0] || null;

        const boxNumber = getBoxNumber(label);

        if (operation === '=') {
            boxes[boxNumber][label] = Number(focus);
            table[label] = boxNumber;
        }

        if (operation === '-') {
            delete boxes[boxNumber][label];
            delete table[label];
        }


    });

    return { boxes, table };
}

const getTotalFocusingPower = () => {
    const { boxes, table } = setupBoxes();

    const labels = Object.keys(table);


    return labels.reduce((acc, label) => {
        const boxNumber = table[label];

        const box = boxNumber + 1;
        const slot =  Object.keys(boxes[boxNumber]).findIndex((l) => l === label) + 1;
        const focus = boxes[boxNumber][label];

        return acc + (box * slot * focus);
    }, 0);
}

const result = getTotalFocusingPower();

console.timeEnd('Runtime');
console.log('Result: ', result);