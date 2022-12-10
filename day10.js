import { parseLinesFromFile, writeAnswer } from './helpers.js';

function isSignalCycle(x) {
    return x === 20 || (x - 20) % 40 === 0;
}

function addSignalStrenth(cycle, val, signals) {
    if (isSignalCycle(cycle)) {
        signals.push(cycle * val);
    }
    return signals;
}

function addPixel(cycle, val, pixels) {
    pixels.push(getPixel(cycle, val));
    return pixels;
}

function getPixel(cycle, x) {
    const pos = (cycle - 1) % 40;
    if (pos >= (x-1) && pos <= (x+1)) {
        return '#';
    }
    return '.';
}

function generateState(input, updateFn) {
    const state = input.reduce((all, instruction) => {
        let startingCycle = all.cycle;
        let nextCycle = instruction === 'noop' ? startingCycle + 1 : startingCycle + 2;
        let nextX = all.x;
        if (instruction !== 'noop') {
            const [_, valStr] = instruction.split(' ');
            const val = parseInt(valStr, 10);
            nextX = all.x + val;
            updateFn(startingCycle+1, all.x, all.results);
        }
        updateFn(nextCycle, all.x, all.results);
        all.x = nextX;
        all.cycle = nextCycle;
        return all;
    }, {
        x: 1,
        cycle: 0,
        results: [],
    });
    return state.results;
}

function determineSignals(input) {
    return generateState(input, addSignalStrenth);
}

function generateScreen(input) {
    return generateState(input, addPixel);
}

function drawScreen(pixels) {
    for (let i=0; i<pixels.length; i=i+40) {
        console.log(pixels.slice(i, i+40).join(''));
    }
}

function getAnswer(signals) {
    return signals.reduce((cur, signal) => cur + signal, 0);
}

function solveProblem1(filename) {
    const input = parseLinesFromFile(filename);
    const signals = determineSignals(input);
    const answer = getAnswer(signals);
    writeAnswer(answer);

}

function solveProblem2(filename) {
    const input = parseLinesFromFile(filename);
    const pixels = generateScreen(input);
    drawScreen(pixels);
}

const filename = './day10.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);
