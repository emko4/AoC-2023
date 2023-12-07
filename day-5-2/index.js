const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n\n');

const getConfigurations = (line) => {
    return line.split(':')[1].trim().split('\n').map((config) => {
        const [destination, source, range] = config.split(' ').map(Number);

        return { source, destination, range };
    });
}

const seedsTuples = lines[0].split(':')[1].trim().split(' ').map(Number).map((seed, index, array) => {
    if (index % 2 === 0) {
        return [seed, array[index + 1]];
    }

    return null;
}).filter(Boolean)

const seedToSoil = getConfigurations(lines[1]);
const soilToFertilizer = getConfigurations(lines[2]);
const fertilizerToWater = getConfigurations(lines[3]);
const waterToLight = getConfigurations(lines[4]);
const lightToTemperature = getConfigurations(lines[5]);
const temperatureToHumidity = getConfigurations(lines[6]);
const humidityToLocation = getConfigurations(lines[7]);

const transition = (inputNumber, configs) => {
    return configs.reduce((acc, config) => {
        if (inputNumber >= config.source && inputNumber < config.source + config.range) {
            return inputNumber + (config.destination - config.source);
        }

        return acc;
    }, inputNumber);
}

const fromSeedToLocation = (seed) => {
    const soil = transition(seed, seedToSoil);
    const fertilizer = transition(soil, soilToFertilizer);
    const water = transition(fertilizer, fertilizerToWater);
    const light = transition(water, waterToLight);
    const temperature = transition(light, lightToTemperature);
    const humidity = transition(temperature, temperatureToHumidity);
    const location = transition(humidity, humidityToLocation);

    return location;
}

console.log('Seeds: ', seedsTuples);

console.time('Brute force');
let minimumLocation = Infinity;
seedsTuples.forEach(([start, length]) => {
    console.log('[DEV]', start, length);
    for (let i = start; i < start + length; i++) {
        const location = fromSeedToLocation(i);

        if (location < minimumLocation) {
            minimumLocation = location;
        }
    }
    console.timeLog('Brute force');
});
console.timeEnd('Brute force');

const result = minimumLocation;

console.log('Result: ', result)