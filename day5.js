import { parseLinesFromFile, writeAnswer } from './helpers.js';

function generateCrateLetter(crateString) {
    const letter = crateString.match(/[A-Z]/);
    return letter ? letter[0] : undefined;
}

function updateStacks(input, stacks, crateLength = 3) {
    const iterator = input[Symbol.iterator]();
    let current = iterator.next();
    const stack = [];
    let crate = current.value;
    let stackNum = 1;

    while (!current.done) {
        // Get the stack
        while (crate.length < crateLength) {
            current = iterator.next();
            crate = `${crate}${current.value}`;
        }
        const letter = generateCrateLetter(crate);
        if (letter) {
            if (!stacks.has(stackNum)) {
                stacks.set(stackNum, []);
            }
            stacks.get(stackNum).push(letter);
        }
        // skip a space
        if (!current.done) {
            current = iterator.next(); // space
            crate = '';    
            stackNum++;
        }
    }
    return stack;
}

function generateInstruction(line) {
    const nums = line.match(/[0-9]+/g);
    return {
        move: parseInt(nums[0], 10),
        from: parseInt(nums[1], 10),
        to: parseInt(nums[2], 10),
    }
}

function isStackCountLine(line) {
    return line.match(/([a-z]|[A-Z])/) === null;
}

function isEmptyLine(line) {
    return line.trim() === '';
}

function moveCrates(stacks, instruction) {
    for (let i=0; i<instruction.move; i++) {
        const crateToMove = stacks.get(instruction.from).shift();
        stacks.get(instruction.to).unshift(crateToMove);
    }
    return stacks;
} 

function bulkMoveCrates(stacks,instruction) {
    const stackFrom = stacks.get(instruction.from);
    const stackTo = stacks.get(instruction.to);
    const cratesToMove = stackFrom.splice(0, instruction.move);
    const updated = cratesToMove.concat(stackTo);
    stacks.set(instruction.to, updated);
}

function parseStackNums(line) {
   return line.match(/[0-9]+/g); 
}

function parseStateFromInput(filename) {
    const inputArray = parseLinesFromFile(filename);
    return inputArray.reduce((state, line) => {
        if (isEmptyLine(line)) {
            state.stacksComplete = true;
        } else if (isStackCountLine(line)) {
            state.sortedStackNums = parseStackNums(line);
        } else if (state.stacksComplete) {
            state.instructions.push(generateInstruction(line));
        } else {
            updateStacks(line, state.stacks);
        }
        return state;
    }, { stacks: new Map(), instructions: [], stacksComplete: false, sortedStackNums: undefined });
}

function readAnswer(state) {
    return state.sortedStackNums.reduce((str, stackNum) => {
        const stack = state.stacks.get(parseInt(stackNum,10));
        const topCrate = stack.shift();
        if (topCrate) {
            return `${str}${topCrate}`;
        }
        return str;
    }, '');
}

function solveProblem1(filename) {
    const state = parseStateFromInput(filename);

    state.instructions.forEach(instruction => {
        moveCrates(state.stacks, instruction);
    });

    const answer = readAnswer(state);
    writeAnswer(answer);
}

function solveProblem2(filename) {
    const state = parseStateFromInput(filename);

    state.instructions.forEach(instruction => {
        bulkMoveCrates(state.stacks, instruction);
    });

    const answer = readAnswer(state);
    writeAnswer(answer, 2);
}

const filename = './day5.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename); 