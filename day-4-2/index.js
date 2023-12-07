const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const cards = data.toString().split('\n');

const cardCounts = cards.reduce((acc, card, index) => {
    const [cardIdText, winningNumbersText, numbersText] = card.split(/:|\|/g);

    const cardId = cardIdText.replace(/[^\d]/g, '');
    const winningNumbers = winningNumbersText.trim().replace(/\s+/g, ' ').split(' ').map((number) => Number(number));
    const numbers = numbersText.trim().replace(/\s+/g, ' ').split(' ').map((number) => Number(number));

    console.log('Run for card: ', cardId);
    let increaseCardIndex = index + 1;
    const increaseCount = acc[index];
    winningNumbers.forEach((winningNumber) => {
        if (numbers.includes(winningNumber)) {
            acc[increaseCardIndex] += increaseCount;
            increaseCardIndex += 1;
        }
    });

    console.log(acc);

    return acc;
}, Array(cards.length).fill(1));

const result = cardCounts.reduce((acc, cardCount) => acc + cardCount, 0);

console.log('Result: ', result);