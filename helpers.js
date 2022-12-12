import fs from 'fs';

export function readFile(filename) {
    return fs.readFileSync(filename, 'utf8');
}

export function parseLinesFromFile(filename) {
    return parseFile(filename, '\n');
}

export function parseFile(filename, separator) {
    const input = readFile(filename);
    return input.split(separator);
}

export function writeAnswer(output, part = 1) {
    console.log(`Final answer for part ${part}: `, output);
}

export function getAlphabet() {
    return 'abcdefghijklmnopqrstuvwxyz';
}