console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const copyConstant = 5;

const lines = data.toString().split('\n');
const springs = lines.map((line) => {
    const [incomplete, complete] = line.split(' ');

    return {
        incomplete: Array(copyConstant).fill(incomplete).join('?').split(''),
        complete: Array(copyConstant).fill(complete).join(',').split(',').map(Number),
    }
});

const regexStartWithHashes = /^[#]+/;

const getMatchesIndexes = (string, group, index) => {
    const regex = new RegExp(`^[?#]{${group}}[?.]{1}$`);

    const substring = string.slice(index);

    const matches = [];
    for (let i = 0; i < substring.length - group + 1; i++) {
        const currentSubstring = substring.slice(i, i + group + 1);

        if (regex.test(currentSubstring)) {
            matches.push(index + i);
        }

        if (regexStartWithHashes.test(currentSubstring)) {
            break;
        }
    }

    return matches;
}

const hasAnotherHashInRest = (string, index) => {
    return string.slice(index).includes('#');
}

let callCount = 0;

const processGroup = (memo, groups, string, level = 0, index = 0) => {
    callCount += 1;
    const [currentGroup, ...restGroups ] = groups;

    const indexes = getMatchesIndexes(string, currentGroup, index)

    if (!restGroups.length) {
        const filteredIndexes = indexes.filter((i) => !hasAnotherHashInRest(string, i + currentGroup + 1));

        return filteredIndexes.length;
    }

    return indexes.reduce((acc, i) => {
        const currentIndex = i + currentGroup + 1;

        let count = 0;
        if (memo[level][i] !== undefined) {
            count = memo[level][i];
        } else {
            count = processGroup(memo, restGroups, string, level + 1, currentIndex);
            memo[level][i] = count;
        }

        return acc + count;
    }, 0);
}

const processString = (complete, incomplete) => {
    const trailingIncomplete = [...incomplete, '.'];
    const incompleteString = trailingIncomplete.join('');

    const memo = Array(complete.length - 1).fill().map(() => Array(trailingIncomplete.length).fill(undefined));

    const count = processGroup(memo, complete, incompleteString);

    return count;
}

const processLine = (complete, incomplete) => {
    const result = processString(complete, incomplete);

    return result;
}

const result = springs.reduce((acc, spring, index) => {
    const { complete, incomplete } = spring;

    const count = processLine(complete, incomplete);

    return acc + count;
}, 0);

console.timeEnd('Runtime');
console.log('Call count:', callCount);
console.log('Result: ', result);