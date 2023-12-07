const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const lines = data.toString().split('\n\n');

const getConfigurations = (line) => {
    return line.split(':')[1].trim().split('\n').map((config) => {
        const [destination, source, range] = config.split(' ').map(Number);

        return { source, destination, range };
    });
}

const seeds = lines[0].split(':')[1].trim().split(' ').map(Number);
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


const locations = seeds.map((seed) => {
    const soil = transition(seed, seedToSoil);
    const fertilizer = transition(soil, soilToFertilizer);
    const water = transition(fertilizer, fertilizerToWater);
    const light = transition(water, waterToLight);
    const temperature = transition(light, lightToTemperature);
    const humidity = transition(temperature, temperatureToHumidity);
    const location = transition(humidity, humidityToLocation);

    return location;
});

console.log('Seeds:\t\t', seeds);
console.log('Locations:\t', locations);
const result = Math.min(...locations);

console.log('Result: ', result)