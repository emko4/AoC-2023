console.time('Runtime');

const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const copyConstant = 1;

const lines = data.toString().split('\n');
const springs = lines.map((line) => {
    const [incomplete, complete] = line.split(' ');

    return {
        incomplete: Array(copyConstant).fill(incomplete).join('?').split(''),
        complete: Array(copyConstant).fill(complete).join(',').split(',').map(Number),
    }
});

const getSubregex = (complete, substring) => {
    let hashCount = (substring.match(/#/g) || []).length;

    const completeSubset = complete.reduce((acc, number) => {
        if (number <= hashCount) {
            hashCount -= number;
            return [...acc, number];
        }

        hashCount = 0;
        return acc;
    }, []);

    if (completeSubset.length === 0) return /\.*/;

    const r = completeSubset.map((number) => `#{${number}}`).join('\\.+');
    const regex = new RegExp(`^\\.*${r}(\\.+|$)`);

    return regex;
}

const checkPossibility = (complete, incomplete, substring) => {
    const incompleteSubstring = `${substring}${incomplete.slice(substring.length).join('')}`;

    const sHashCount = (incompleteSubstring.match(/#/g) || []).length;
    const sDotCount = (incompleteSubstring.match(/\./g) || []).length;

    const hashCount = complete.reduce((acc, number) => acc + number, 0);
    const dotCount = incomplete.length - hashCount;

    if (sDotCount > dotCount || sHashCount > hashCount) {
        return false;
    }

    return true;
}

const checkGroups = (complete, substring) => {
    const groups = (substring.replace(/#+$/, '').match(/#+/g) || []).map((group) => group.length);

    return groups.every((group, index) => group === complete[index]);
}

let callCount = 0;

const processString = (complete, incomplete, regex, substring = '') => {
    callCount += 1;

    const currentIndex = substring.length;
    const currentSubstrings = incomplete[currentIndex] === '?' ? [`${substring}#`, `${substring}.`] : [`${substring}${incomplete[currentIndex]}`];

    return currentSubstrings.reduce((acc, s) => {
        const subregex = getSubregex(complete, substring);

        let count = 0;

        if (s.length < incomplete.length && checkPossibility(complete, incomplete, s) && checkGroups(complete, s) && subregex.test(s)) {
            count += processString(complete, incomplete, regex, s);
        }

        if (s.length === incomplete.length && regex.test(s)) {
            count += 1;
        }

        return acc + count;
    }, 0);
}

const processLine = (complete, incomplete) => {
    const r = complete.map((number) => `#{${number}}`).join('\\.+');
    const regex = new RegExp(`^\\.*${r}\\.*$`);

    const result = processString(complete, incomplete, regex);

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