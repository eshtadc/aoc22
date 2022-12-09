import { parseLinesFromFile, writeAnswer } from './helpers.js';

function persistPosition([x, y], moves) {
    moves.set(`${x}_${y}`, true);
}

function initialState(numHeads = 1) {
    const state = {
        tailMoves: new Map(),
        heads: new Array(numHeads).fill([0,0]),
        tail: [0,0],
    };
    persistPosition(state.tail, state.tailMoves);
    return state;
}

function moveCoord(dir, [x, y]) {
    switch (dir) {
        case 'R':
            return [x+1, y];
        case 'L':
            return [x-1, y];
        case 'U':
            return [x, y-1];
        case 'D':
            return [x, y+1];
    }
}

function isTouching([tailX, tailY], [headX, headY]) {
    return Math.abs(headX - tailX) <= 1 && Math.abs(headY - tailY) <= 1;
}

function catchUp([tailX, tailY], [headX, headY]) {
    let newTailX = tailX;
    let newTailY = tailY;
    if (Math.abs(headX - tailX) >= 1) {
        const adj = headX > tailX ? 1 : -1;
        newTailX = tailX + adj;
    }
    if (Math.abs(headY - tailY) >= 1) {
        const adj = headY > tailY ? 1 : -1;
        newTailY = tailY + adj;
    }
    return [newTailX, newTailY];
}

function moveRope(direction, state) {
    let lastKnot;
    let rope = [...state.heads, state.tail];
    let newHeads = rope.map((knot, i) => {
        if (i === 0) {
            lastKnot = moveCoord(direction, knot);
            return lastKnot;
        }
        let tail = [...knot];
        if (!isTouching(tail, lastKnot)) {
            tail = catchUp(tail, lastKnot);
        }
        lastKnot = tail;
        return tail;
    });
    state.tail = newHeads.pop();
    state.heads = newHeads;
    persistPosition(state.tail, state.tailMoves);
}

function processMove(direction, count, state) {
    for (let i=0; i<count; i++) {
        moveRope(direction, state);
    }
}

function countUniqueMoves(moves) {
    return moves.size;
}

function solveProblem(filename, numHeads) {
    const input = parseLinesFromFile(filename);
    const state = input.reduce((current, instruction) => {
        const [dir, countStr] = instruction.split(' ');
        processMove(dir, parseInt(countStr, 10), current);
        return current;
    }, initialState(numHeads));

    return countUniqueMoves(state.tailMoves);
}

function solveProblem1(filename) {
    const answer = solveProblem(filename, 1);
    writeAnswer(answer);

}

function solveProblem2(filename) {
    const answer = solveProblem(filename, 9);
    writeAnswer(answer, 2);
}

const filename = './day9.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);
