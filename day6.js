import { readFile, writeAnswer } from './helpers.js';

function isUnique(str) {
    return str.length === new Set(str).size;
}

function findStartOfPacketMarker(str, unique=4) {
    for (let i=unique; i<str.length; i++) {
        if (isUnique(str.substring(i-unique, i))) {
            return i;
        }
    }
}

function solveTestProblems() {
    const tests = [
        'mjqjpqmgbljsphdztnvjfqwrcgsmlb',
        'bvwbjplbgvbhsrlpgdmjqwftvncz',
        'nppdvjthqldpwncqszvftbrmjlhg',
        'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
        'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'
    ];
    tests.forEach((input) => {
        writeAnswer(findStartOfPacketMarker(input, 14), `Test ${input}`);
    })
}

function solveProblem1(filename) {
    const input = readFile(filename);
    const answer = findStartOfPacketMarker(input);
    writeAnswer(answer);
}

function solveProblem2(filename) {
    const input = readFile(filename);
    const answer = findStartOfPacketMarker(input, 14);
    writeAnswer(answer, 2);
}

const filename = './day6.puzzle.txt';
solveTestProblems();
solveProblem1(filename);
solveProblem2(filename); 