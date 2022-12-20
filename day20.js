import { parseLinesFromFile, writeAnswer } from './helpers.js';

function mixCoordinates(raw, decryptionKey=1, times=1) {
    const parsed = raw.map((coord, index) => {
        return {
            val: Number(coord) * decryptionKey,
            index,
        }
    });
    for (let t = 0; t < times; t++) {
        for (let i = 0; i < parsed.length; i++) {
            const coordIndex = parsed.findIndex((item) => item.index === i);
            const val = parsed[coordIndex].val;
            parsed.splice(coordIndex, 1);
            parsed.splice((val + coordIndex) % parsed.length, 0, { val, index: i })
        }
    }
    return parsed.map(item => item.val);
}

function getCoordinatesSum(mixed) {
    const zeroIndex = mixed.indexOf(0);
    const coord1000 = mixed[(zeroIndex + 1000) % mixed.length];
    const coord2000 = mixed[(zeroIndex + 2000) % mixed.length];
    const coord3000 = mixed[(zeroIndex + 3000) % mixed.length];
    return Number(coord1000) + Number(coord2000) + Number(coord3000);
}

function solveProblem1(isSample=true) { // 3 | 2203
    const filename = isSample ? `./day20.sample.txt` : './day20.puzzle.txt';
    const coordinates = parseLinesFromFile(filename);
    const mixed = mixCoordinates(coordinates);
    const answer = getCoordinatesSum(mixed);
    writeAnswer(answer);
}

function solveProblem2(isSample=true) {
    const filename = isSample ? `./day20.sample.txt` : './day20.puzzle.txt';
    const coordinates = parseLinesFromFile(filename);
    const mixed = mixCoordinates(coordinates, 811589153, 10);
    const answer = getCoordinatesSum(mixed);
    writeAnswer(answer, 2);
}

solveProblem1(true);
solveProblem2(false);
