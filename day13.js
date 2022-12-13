import { parseFile, writeAnswer } from './helpers.js';

function parsePackets(filename) {
    const pairs = parseFile(filename, '\n\n');
    return pairs.map(lines => {
        const packets = lines.split('\n');
        return packets.map(JSON.parse);
    });
}

function compareArray(compareLeft, compareRight) {
    const left = JSON.parse(JSON.stringify(compareLeft));
    const right = JSON.parse(JSON.stringify(compareRight));
    while (left.length && right.length) {
        const leftItem = left.shift();
        const rightItem = right.shift();

        if (typeof leftItem === 'number' && typeof rightItem === 'number') {
            if (leftItem !== rightItem) {
                return leftItem < rightItem;
            }
        } else if (typeof leftItem === 'number') {
            const res = compareArray([leftItem], rightItem);
            if (typeof res === 'boolean') {
                return res;
            }
        } else if (typeof rightItem === 'number') {
            const res = compareArray(leftItem, [rightItem]);
            if (typeof res === 'boolean') {
                return res;
            }
        } else {
            const res = compareArray(leftItem, rightItem);
            if (typeof res === 'boolean') {
                return res;
            }
        }
    }

    if (right.length) return true;
    if (left.length) return false;
}

function sorter(left, right) {
    const result = compareArray(left, right);
    if (result === true) {
        return -1
    }
    if (result === false) {
        return 1;
    }
    return 0;
}

function solveProblem1(filename) {
    const pairs = parsePackets(filename);
    const answer = pairs.reduce((sum, [packet1, packet2], i) => {
        if (compareArray(packet1, packet2)) {
            sum = sum + i + 1;
        }
        return sum;
    }, 0);
    writeAnswer(answer);
}

function getDecoderKey(packets) {
    const divider1Index = packets.findIndex(i => JSON.stringify(i) === '[[2]]') + 1;
    const divider2Index = packets.findIndex(i => JSON.stringify(i) === '[[6]]') + 1;
    return divider1Index * divider2Index;
}

function solveProblem2(filename) {
    const pairs = parsePackets(filename);
    const all = [...pairs.flat(), [[2]], [[6]]];
    all.sort(sorter);
    const answer = getDecoderKey(all);
    writeAnswer(answer, 2);
}

// const filename = './day13.sample.txt';
const filename = './day13.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);
