const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const hands = data.toString().split('\n').map((hand) => {
    const [cards, bid] = hand.split(' ');

    const numberedCards = cards.split('').map((card) => {
        if (card === 'A') return 14;
        if (card === 'K') return 13;
        if (card === 'Q') return 12;
        if (card === 'J') return 11;
        if (card === 'T') return 10;

        return Number(card);
    });

    return { cards: numberedCards, bid: Number(bid) };
});

console.log('Hands: ', hands);

const getRank = (cards) => {
    const table = cards.reduce((acc, card) => {
        return { ...acc, [card]: acc[card] ? acc[card] += 1 : 1 };
    }, {})

    const uniqueNumbers = Object.keys(table);

    if (uniqueNumbers.length === 1) return 7;
    if (uniqueNumbers.length === 2 && (table[uniqueNumbers[0]] === 4 || table[uniqueNumbers[1]] === 4)) return 6;
    if (uniqueNumbers.length === 2 && ((table[uniqueNumbers[0]] === 3 && table[uniqueNumbers[1]] === 2) || (table[uniqueNumbers[0]] === 2 && table[uniqueNumbers[1]] === 3))) return 5;
    if (uniqueNumbers.length === 3 && (table[uniqueNumbers[0]] === 3 || table[uniqueNumbers[1]] === 3 || table[uniqueNumbers[2]] === 3)) return 4;
    if (uniqueNumbers.length === 3 && (
        (table[uniqueNumbers[0]] === 2 && table[uniqueNumbers[1]] === 2) ||
        (table[uniqueNumbers[0]] === 2 && table[uniqueNumbers[2]] === 2) ||
        (table[uniqueNumbers[1]] === 2 && table[uniqueNumbers[2]] === 2)
    )) return 3;
    if (uniqueNumbers.length === 4) return 2

    return 1;
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