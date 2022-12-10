import { parseLinesFromFile, writeAnswer } from './helpers.js';

function isSignalCycle(x, offset = 0) {
    return x === 20 || (x - 20) % 40 === 0;
}

function addSignalStrenth(cycle, val, signals, offset = 0) {
    if (isSignalCycle(cycle, offset)) {
        console.log('Signal', cycle, val);
        signals.push(cycle * val);
    }
    return signals;
}

function determineSignals(input) {
    const signalOffset = 20;
    const state = input.reduce((all, instruction) => {
        let startingCycle = all.cycle;
        let nextCycle = instruction === 'noop' ? startingCycle + 1 : startingCycle + 2;
        let nextX = all.x;
        if (instruction !== 'noop') {
            const [_, valStr] = instruction.split(' ');
            const val = parseInt(valStr, 10);
            nextX = all.x + val;
            addSignalStrenth(startingCycle+1, all.x, all.signals, signalOffset);
        }
        addSignalStrenth(nextCycle, all.x, all.signals);
        all.x = nextX;
        all.cycle = nextCycle;
        return all;
    }, {
        cycles: new Map(),
        x: 1,
        cycle: 0,
        signals: [],
    });
    return state.signals;
}

function getPixel(cycle, x) {
    const pos = (cycle - 1) % 40;
    if (pos >= (x-1) && pos <= (x+1)) {
        return '#';
    }
    return '.';
}

function generateScreen(input) {
    const state = input.reduce((all, instruction) => {
        let startingCycle = all.cycle;
        let nextCycle = instruction === 'noop' ? startingCycle + 1 : startingCycle + 2;
        let nextX = all.x;
        if (instruction !== 'noop') {
            const [_, valStr] = instruction.split(' ');
            const val = parseInt(valStr, 10);
            nextX = all.x + val;
            all.pixels.push(getPixel(startingCycle+1, all.x));
        }
        all.pixels.push(getPixel(nextCycle, all.x));
        all.x = nextX;
        all.cycle = nextCycle;
        return all;
    }, {
        pixels: [],
        x: 1,
        cycle: 0,
        signals: [],
    });
    return state.pixels;
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
