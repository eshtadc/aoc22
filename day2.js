import { parseLinesFromFile, writeAnswer } from './helpers.js';

const strategyMove1 = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
};
const strategyMove2 = {
    X: 'rock',
    Y: 'paper',
    Z: 'scissors',
};
const beats = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
};

const losesTo = {
    rock: 'paper',
    paper: 'scissors',
    scissors: 'rock',
};

const moveScore = {
    X: 1,
    Y: 2,
    Z: 3,
    rock: 1,
    paper: 2,
    scissors: 3,
}

const outcomeScore = {
    X: 0,
    Y: 3,
    Z: 6,
}

function roundScore(player1, player2) {
    const move1 = strategyMove1[player1];
    const move2 = strategyMove2[player2];
    if (move1 === move2) {
        // draw
        return 3;
    }
    if (beats[move2] === move1) {
        // win
        return 6
    }
    return 0;
}

function getMoveForOutcome(move, outcome) {
    const played = strategyMove1[move];
    if (outcome === 'Y') { // draw
        return played;
    }
    if (outcome === 'Z') { // win
        return losesTo[played];
    }
    // lose
    return beats[played];
}

function solveProblem1(filename) {
    const input = parseLinesFromFile(filename);

    const totalScore = input.reduce((score, moves) => {
        const [move1, move2] = moves.trim().split(' ');
        return score + roundScore(move1, move2) + moveScore[move2];
    }, 0);

    writeAnswer(totalScore);
}

function solveProblem2(filename) {
    const input = parseLinesFromFile(filename);

    const totalScore = input.reduce((score, strategy) => {
        const [move, outcome] = strategy.trim().split(' ');
        const moveToPlay = getMoveForOutcome(move, outcome);
        return score + moveScore[moveToPlay] + outcomeScore[outcome];
    }, 0);

    writeAnswer(totalScore, 2);
}

const filename = './day2.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);