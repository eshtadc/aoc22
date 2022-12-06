import fs from 'fs';

export function readFile(filename) {
    return fs.readFileSync(filename, 'utf8');
}

export function parseLinesFromFile(filename) {
    const input = readFile(filename);
    return input.split('\n');
}

export function writeAnswer(output, part = 1) {
    console.log(`Final answer for part ${part}: `, output);
}

export function getAlphabet() {
    return 'abcdefghijklmnopqrstuvwxyz';
}