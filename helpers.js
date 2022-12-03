import fs from 'fs';

export function parseLinesFromFile(filename) {
    const input = fs.readFileSync(filename, 'utf8');
    return input.split('\n');
}

export function writeAnswer(output, part = 1) {
    console.log(`Final answer for part ${part}: `, output);
}

export function getAlphabet() {
    return 'abcdefghijklmnopqrstuvwxyz';
}