import { parseLinesFromFile } from './helpers.js';

function findMax(input) {
    const elves = input.reduce((state, val) => {
        if (val === '') {
            state.max = Math.max(state.max, state.current);
            state.current = 0;
            return state;
        }
        state.current = state.current + parseInt(val, 10);
        return state;
    }, { max: 0, current: 0 });
    return Math.max(elves.max, elves.current);
}

function adjustMax3(state) {
    if (state.current > state.max[2]) {
        state.max.push(state.current);
        state.max.sort((a, b) => b - a);
        state.max.splice(3);
    }
    state.current = 0;
}

function findMax3(input) {
    const elves = input.reduce((state, val) => {
        if (val === '') {
            adjustMax3(state);
            return state;
        }
        state.current = state.current + parseInt(val, 10);
        return state;
    }, { max: [0,0,0], current: 0 });
    adjustMax3(elves);
    return elves.max[0] + elves.max[1] + elves.max[2];
}

function solveProblem1(filename) {
    const input = parseLinesFromFile(filename);
    const calories = findMax(input);
    console.log('max calories part 1', calories);
}

function solveProblem2(filename) {
    const input = parseLinesFromFile(filename);
    const calories = findMax3(input);
    console.log('max calories part 2', calories);
}
solveProblem1('./day1.puzzle.txt');
solveProblem2('./day1.puzzle.txt');