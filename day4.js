import { parseLinesFromFile, writeAnswer } from './helpers.js';

function splitLists(list1, list2) {
    const range1 = list1.split('-');
    const range2 = list2.split('-');
    return [[parseInt(range1[0],10), parseInt(range1[1],10)], [parseInt(range2[0],10), parseInt(range2[1],10)]]
}

function sortRanges(range1, range2) {
    const [lower, higher] = range1[0] < range2[0] ? [range1, range2] : [range2, range1];
    return [lower, higher];
}

function rangesContained(range1, range2) {
    if (range1[0] === range2[0] || range1[1] === range2[1]) {
        // exp 2-4,2-5 or 2-4,1-4 always would be containing
        return true;
    }
    const [lower, higher] = sortRanges(range1, range2);
    return lower[1] > higher[1];
}

function rangesOverlap(range1, range2) {
    if (rangesContained(range1, range2)) {
        return true;
    }
    const [lower, higher] = sortRanges(range1, range2);
    return lower[1] >= higher[0];
}

function solveProblem(filename, compareFn) {
    const input = parseLinesFromFile(filename);

    return input.reduce((total, line) => {
        const pairs = line.split(',');
        const [range1, range2] = splitLists(...pairs);
        if (compareFn(range1, range2)) {
            return total + 1;
        }
        return total;
    }, 0);
}

function solveProblem1(filename) {
    const answer = solveProblem(filename, rangesContained);
    writeAnswer(answer);
}

function solveProblem2(filename) {
    const answer = solveProblem(filename, rangesOverlap);
    writeAnswer(answer, 2);
}

const filename = './day4.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename); 