// random: [min; max]
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}