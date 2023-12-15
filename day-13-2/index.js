console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const patterns = data.toString().split('\n\n').map((pattern) => {
    return pattern.split('\n');
});

const possibleChangeConstant = 1;

const areLinesSame = (lineA, lineB) => {
    if (!lineA || !lineB) {
        return Infinity;
    }

    const differentCount = lineA.split('').reduce((acc, char, index) => {
       if (char !== lineB[index]) return acc + 1;

       return acc;
    }, 0);

    return differentCount;
}

const getSameHorizontalLines = (pattern) => {
    return pattern.reduce((acc, line, index) => {
        if (areLinesSame(line, pattern[index + 1]) <= possibleChangeConstant) {
            return [...acc, [index, index + 1]];
        }

        return acc;
    }, []);
}

const isPerfectHorizontalReflection = (pattern, center) => {
    let [topIndex, bottomIndex] = center;

    const count = topIndex + 1;

    let isPerfect = true;
    let differences = 0;
    while (isPerfect && topIndex >= 0 && bottomIndex < pattern.length) {
        const diff = areLinesSame(pattern[topIndex], pattern[bottomIndex]);

        if (diff > possibleChangeConstant) {
            isPerfect = false;
            break;
        }

        topIndex -= 1;
        bottomIndex += 1;
        differences += diff;
    }

    return { isPerfect: isPerfect && differences === possibleChangeConstant, count };
}

const getSameVerticalLines = (pattern) => {
    return Array(pattern[0].length).fill(0).reduce((acc, nothing, index) => {
        const indexColumn = pattern.map((line) => line[index]).join('');
        const nextIndexColumn = pattern.map((line) => line[index + 1]).join('');

        if (areLinesSame(indexColumn, nextIndexColumn) <= possibleChangeConstant) {
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
    let differences = 0;
    while (isPerfect && leftIndex >= 0 && rightIndex < columnLength) {
        const leftColumn = pattern.map((line) => line[leftIndex]).join('');
        const rightColumn = pattern.map((line) => line[rightIndex]).join('');

        const diff = areLinesSame(leftColumn, rightColumn);

        if (diff > possibleChangeConstant) {
            isPerfect = false;
            break;
        }

        leftIndex -= 1;
        rightIndex += 1;
        differences += diff;
    }

    return { isPerfect: isPerfect && differences === possibleChangeConstant, count };
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