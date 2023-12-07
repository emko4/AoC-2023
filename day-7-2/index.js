const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const hands = data.toString().split('\n').map((hand) => {
    const [cards, bid] = hand.split(' ');

    const numberedCards = cards.split('').map((card) => {
        if (card === 'A') return 13;
        if (card === 'K') return 12;
        if (card === 'Q') return 11;
        if (card === 'T') return 10;
        if (card === 'J') return 1;

        return Number(card);
    });

    return { cards: numberedCards, bid: Number(bid) };
});

console.log('Hands: ', hands);

const getRank = (cards) => {
    const jokersCount = cards.reduce((acc, card) => card === 1 ? acc += 1 : acc, 0);
    const withoutJoker = cards.filter((card) => card > 1);

    const table = withoutJoker.reduce((acc, card) => {
        return { ...acc, [card]: acc[card] ? acc[card] += 1 : 1 };
    }, {});

    const uniqueNumbers = Object.keys(table);

    if (jokersCount === 0) {
        // poker
        if (uniqueNumbers.length === 1) return 7;
        // four
        if (uniqueNumbers.length === 2 && (table[uniqueNumbers[0]] === 4 || table[uniqueNumbers[1]] === 4)) return 6;
        // full house
        if (uniqueNumbers.length === 2 && ((table[uniqueNumbers[0]] === 3 && table[uniqueNumbers[1]] === 2) || (table[uniqueNumbers[0]] === 2 && table[uniqueNumbers[1]] === 3))) return 5;
        // three
        if (uniqueNumbers.length === 3 && (table[uniqueNumbers[0]] === 3 || table[uniqueNumbers[1]] === 3 || table[uniqueNumbers[2]] === 3)) return 4;
        // double two
        if (uniqueNumbers.length === 3 && (
            (table[uniqueNumbers[0]] === 2 && table[uniqueNumbers[1]] === 2) ||
            (table[uniqueNumbers[0]] === 2 && table[uniqueNumbers[2]] === 2) ||
            (table[uniqueNumbers[1]] === 2 && table[uniqueNumbers[2]] === 2)
        )) return 3;
        // two
        if (uniqueNumbers.length === 4) return 2;

        // nothing
        return 1;
    }

    if (jokersCount === 1) {
        // poker with 1 joker
        if (uniqueNumbers.length === 1) return 7;
        // four with 1 joker
        if (uniqueNumbers.length === 2 && (table[uniqueNumbers[0]] === 3 || table[uniqueNumbers[1]] === 3)) return 6;
        // full house  with 1 joker
        if (uniqueNumbers.length === 2 && (table[uniqueNumbers[0]] === 2 && table[uniqueNumbers[1]] === 2)) return 5;
        // three with 1 joker
        if (uniqueNumbers.length === 3 && (table[uniqueNumbers[0]] === 2 || table[uniqueNumbers[1]] === 2 || table[uniqueNumbers[2]] === 2)) return 4;

        // double two with 1 joker not possible

        // two with 1 joker
        return 2;
    }

    if (jokersCount === 2) {
        // poker with 2 jokers
        if (uniqueNumbers.length === 1) return 7;
        // four with 2 jokers
        if (uniqueNumbers.length === 2 && (table[uniqueNumbers[0]] === 2 || table[uniqueNumbers[1]] === 2)) return 6;

        // other combinations are not possible

        // three with 2 jokers
        return 4;
    }

    if (jokersCount === 3) {
        // poker with 3 jokers
        if (uniqueNumbers.length === 1) return 7;

        // other combinations are not possible

        // four with 3 jokers
        return 6;
    }

    if (jokersCount === 4) {
        // poker with 4 jokers
        return 7;
    }

    // poker with 5 jokers
    return 7;
}

const compareByCards = (cardsA, cardsB) => {
    for (let i = 0; i < cardsB.length; i++) {
        const r = cardsB[i] - cardsA[i];

        if (r !== 0) return r;
    }

    return 0;
}

const sorted = hands.sort((a, b) => {
    const r = getRank(b.cards) - getRank(a.cards);

    if (r === 0) {
        return compareByCards(a.cards, b.cards);
    }

    return r;
});

const result = sorted.reduce((acc, hand, index) => {
    return acc + (hand.bid * (sorted.length - index));
}, 0);

console.log('Result: ', result);
