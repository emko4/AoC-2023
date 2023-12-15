console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const patterns = data.toString().split('\n\n').map((pattern) => {
    return pattern.split('\n');
});

const getSameHorizontalLines = (pattern) => {
    return pattern.reduce((acc, line, index) => {
        if (line === pattern[index + 1]) {
            return [...acc, [index, index + 1]];
        }

        return acc;
    }, []);
}

const isPerfectHorizontalReflection = (pattern, center) => {
    let [topIndex, bottomIndex] = center;

    const count = topIndex + 1;

    let isPerfect = true;
    while (isPerfect && topIndex >= 0 && bottomIndex < pattern.length) {
        if (pattern[topIndex] !== pattern[bottomIndex]) {
            isPerfect = false;
            break;
        }

        topIndex -= 1;
        bottomIndex += 1;
    }

    return { isPerfect, count };
}

const getSameVerticalLines = (pattern) => {
    return Array(pattern[0].length).fill(0).reduce((acc, nothing, index) => {
        const indexColumn = pattern.map((line) => line[index]).join('');
        const nextIndexColumn = pattern.map((line) => line[index + 1]).join('');

        if (indexColumn === nextIndexColumn) {
            return [...acc, [index, index + 1]];
        }

        return acc;
    }, []);
}

const isPerfectVerticalReflection = (pattern, center) => {
    let [leftIndex, rightIndex] = center;

    const columnLength = pattern[0].length;

    const count = leftIndex + 1;

    let isPerfect = true;
    while (isPerfect && leftIndex >= 0 && rightIndex < columnLength) {
        const leftColumn = pattern.map((line) => line[leftIndex]).join('');
        const rightColumn = pattern.map((line) => line[rightIndex]).join('');

        if (leftColumn !== rightColumn) {
            isPerfect = false;
            break;
        }

        leftIndex -= 1;
        rightIndex += 1;
    }

    return { isPerfect, count };
}

const result = patterns.reduce((acc, pattern) => {
    const sameHorizontalLines = getSameHorizontalLines(pattern);

    const horizontalCount = sameHorizontalLines.reduce((accHorizontal, center) => {
        const { isPerfect, count } = isPerfectHorizontalReflection(pattern, center);
        if (isPerfect) {
            return accHorizontal + (count * 100);
        }

        return accHorizontal;
    }, 0);

    const sameVerticalLines = getSameVerticalLines(pattern);

    const verticalCount = sameVerticalLines.reduce((accVertical, center) => {
        const { isPerfect, count } = isPerfectVerticalReflection(pattern, center);

        if (isPerfect) {
            return accVertical + count;
        }

        return accVertical;
    }, 0);

    return acc + horizontalCount + verticalCount;
}, 0);

console.timeEnd('Runtime');
console.log('Result: ', result);