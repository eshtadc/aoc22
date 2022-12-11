import { parseFile, writeAnswer } from './helpers.js';

function getNumberFromLine(line) {
    const testMatch = line.match(/[0-9]+/);
    return parseInt(testMatch[0])
}

function parseMonkey(info) {
    const [header, itemsLine, operationLine, testLine, ifTrueLine, ifFalseLine] = info.split('\n');
    const [_i, itemsStr] = itemsLine.split(': ');
    const items = itemsStr.split(', ').map(i => parseInt(i, 10));
    const [_o, opStr] = operationLine.split(': ');
    const operation = opStr.substring(6);
    const test = getNumberFromLine(testLine);
    const trueThrow = getNumberFromLine(ifTrueLine);
    const falseThrow = getNumberFromLine(ifFalseLine);
    return {
        items,
        operation,
        test,
        trueThrow,
        falseThrow,
        inspections: 0,
    }
}

function easeWorry(level) {
    return Math.floor(level/3);
}

function monkeyTurn(monkey, worryFn) {
    const throws = monkey.items.map((item) => {
        const operation = monkey.operation.replace(/old/g, item);
        const anxietyLevel = eval(operation);
        const throwLevel = worryFn(anxietyLevel);
        const throwTo = throwLevel % monkey.test === 0 ? monkey.trueThrow : monkey.falseThrow;
        return [throwLevel, throwTo];
    });
    monkey.inspections = monkey.inspections + monkey.items.length;
    monkey.items = [];
    return throws;
}

function playRound(monkeys, worryFn) {
    monkeys.forEach(monkey => {
        const throws = monkeyTurn(monkey, worryFn);
        throws.forEach(([item, throwTo]) => {
            monkeys[throwTo].items.push(item);
        });
    })
}

function watchMonkeys(monkeys, rounds, worryFn) {
    for (let i=0; i<rounds; i++) {
        playRound(monkeys, worryFn);
    }
}

function getMonkeyBusinessLevel(monkeys, num) {
    const inspections = monkeys.map(monkey => monkey.inspections);
    inspections.sort((a,b) => a - b);
    const mostActive = inspections.slice(-num);
    return mostActive.reduce((tot, val) => tot*val);
}

function getMonkeyModulo(monkeys) {
    return monkeys.reduce((mod, monkey) => {
        return mod * monkey.test;
    }, 1);
}

function solveProblem1(filename) {
    const input = parseFile(filename, '\n\n');
    const monkeys = input.map(parseMonkey);
    watchMonkeys(monkeys, 20, easeWorry);
    const answer = getMonkeyBusinessLevel(monkeys, 2);
    writeAnswer(answer);
}

function solveProblem2(filename) {
    const input = parseFile(filename, '\n\n');
    const monkeys = input.map(parseMonkey);
    const mod = getMonkeyModulo(monkeys);
    const worryFn = (level => {
        return level % mod;
    });
    watchMonkeys(monkeys, 10000, worryFn);
    const answer = getMonkeyBusinessLevel(monkeys, 2);
    writeAnswer(answer);
}

const filename = './day11.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);
