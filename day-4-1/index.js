const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const cards = data.toString().split('\n');

const result = cards.reduce((acc, card) => {
    const [cardIdText, winningNumbersText, numbersText] = card.split(/:|\|/g);

    const cardId = cardIdText.replace(/[^\d]/g, '');
    const winningNumbers = winningNumbersText.trim().replace(/\s+/g, ' ').split(' ').map((number) => Number(number));
    const numbers = numbersText.trim().replace(/\s+/g, ' ').split(' ').map((number) => Number(number));

    const cardPrize = winningNumbers.reduce((a, winningNumber) => {
        if (numbers.includes(winningNumber)) {
            return a * 2;
        }

        return a;
    }, 0.5);

    console.log('Card: ', cardId, ', Prize: ', cardPrize);

    return cardPrize < 1 ? acc : acc + cardPrize;
}, 0);

console.log('Result: ', result);