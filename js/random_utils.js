// random: [min; max]
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

// random: [min; max)
export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}