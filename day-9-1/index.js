const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n').map((line) => {
    return line.split(' ').map(Number);
});

console.log('Lines: ', lines);

const getDifferences = (line) => {
    return line.reduce((acc, number, index) => {
        if (index === line.length - 1) return acc;

        return [...acc, line[index + 1] - number];
    }, []);
}

const stacks = lines.map((line) => {
    let history = line;
    const stack = [history[history.length - 1]];

    while (history.some((n) => n !== 0)) {
        history = getDifferences(history);

        stack.push(history[history.length - 1]);
    }

    return stack.reverse();
});

const values = stacks.map((stack) => {
   return stack.reduce((acc, number, index) => {
       return acc + number;
   }, 0);
});

const result = values.reduce((acc, value) => acc + value, 0);

console.log('Result: ', result);