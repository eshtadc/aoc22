import fs from 'fs';

export function parseLinesFromFile(filename) {
    const input = fs.readFileSync(filename, 'utf8');
    return input.split('\n');
}