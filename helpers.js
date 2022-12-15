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

export function drawGrid(grid, [tlX, tlY], [brX, brY], empty='.') {
    for (let y=tlY; y<=brY; y++) {
        let line = '';
        for (let x=tlX; x<=brX; x++) {
            const key = generateGridKey(x,y);
            if (grid.has(key)) {
                line = `${line}${grid.get(key)}`
            } else {
                line = `${line}${empty}`;
            }
        }
        console.log(line);
    }
}