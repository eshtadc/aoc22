import { parseLinesFromFile, writeAnswer } from './helpers.js';

const ROCK = '#';
const AIR = '.';
const SAND = 'o';
const START = [500,0];

function generateGridKey(x, y) {
    return `${x}_${y}`;
}

function addRockLine(rocks, grid) {
    let lastX;
    let lastY;
    let maxX = 0;
    let maxY = 0;
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    for (const coord of rocks) {
        const rockX = parseInt(coord[0], 10);
        const rockY = parseInt(coord[1], 10);
        maxX = Math.max(rockX, maxX);
        maxY = Math.max(rockY, maxY);
        minX = Math.min(rockX, minX);
        minY = Math.min(rockY, minY);
        grid.set(generateGridKey(rockX, rockY), ROCK);
        if (lastX && lastY) {
            // fill in line from last to this
            let deltaX = lastX - rockX;
            let deltaY = lastY - rockY;
            const adjX = deltaX === 0 ? 0 : deltaX > 0 ? -1 : 1;
            const adjY = deltaY === 0 ? 0 : deltaY > 0 ? -1 : 1;
            while (deltaX !== 0 || deltaY !== 0) {
                grid.set(generateGridKey(rockX+deltaX, rockY+deltaY), ROCK);
                deltaX += adjX;
                deltaY += adjY;
            }
        }
        lastX = rockX;
        lastY = rockY;
    }
    return [minX, minY, maxX, maxY];
}

function canMove(currentKey, [moveX, moveY], cave, floor) {
    if (typeof floor === 'number') {
        if ((moveY === floor)) {
            // hit the floor
            return false;
        }
    }
    const moveKey = generateGridKey(moveX, moveY)
    if (!cave.has(moveKey)) {
        cave.delete(currentKey);
        cave.set(moveKey, SAND);
        return true;
    }
    return false;
}

function sandIsFalling([sandX, sandY], cave, floor) {
    const currentSand = generateGridKey(sandX, sandY);
    // can move down?
    if (canMove(currentSand, [sandX, sandY+1], cave, floor)) {
        return [sandX, sandY+1];
    }
    // can move down-left
    if (canMove(currentSand, [sandX-1, sandY+1], cave, floor)) {
        return [sandX-1, sandY+1];
    }

    // can move down-right
    if (canMove(currentSand, [sandX+1, sandY+1], cave, floor)) {
        return [sandX+1, sandY+1];
    }
    return [sandX, sandY];
}

function addSand(cave, floor, isEndless) {
    let sandPosition = START;
    let falling = true;
    while (falling) {
        const fallenPosition = sandIsFalling(sandPosition, cave, isEndless ? undefined : floor);
        falling = fallenPosition[0] !== sandPosition[0] || fallenPosition[1] !== sandPosition[1];
        if (fallenPosition[1] > floor) {
            console.log('OHHHH NOOOOOOOOO')
            throw new Error('Sand has broken free');
        }
        sandPosition = fallenPosition;
    }
    return sandPosition;
}

function parseRocks(filename) {
    return parseLinesFromFile(filename).reduce((state, line) => {
        const coords = line.split(' -> ').map(coord => coord.split(','));
        const [lineMinX, lineMinY, lineMaxX, lineMaxY] = addRockLine(coords, state.rocks);
        state.maxX = Math.max(lineMaxX, state.maxX);
        state.maxY = Math.max(lineMaxY, state.maxY);
        state.minX = Math.min(lineMinX, state.minX);
        state.minY = Math.min(lineMinY, state.minY);
        return state;
    }, { minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: 0, maxY: 0, rocks: new Map() });
}

function fillCave(cave, floor, isEndless = true) {
    let totalGrains = 0;
    let isFilling = true;
    while (isFilling) {
        totalGrains++;
        let sandY;
        try {
            const position = addSand(cave, floor, isEndless);
            sandY = position[1];
        } catch (e) {
            // Escaped sand!!!
            return totalGrains - 1; // last one escaped
        }
        isFilling = sandY !== START[1];
    }
    return totalGrains;
}

function drawCave(cave, [tlX, tlY], [brX, brY]) {
    for (let y=tlY; y<=brY; y++) {
        let line = '';
        for (let x=tlX; x<=brX; x++) {
            const key = generateGridKey(x,y);
            if (cave.has(key)) {
                line = `${line}${cave.get(key)}`
            } else {
                line = `${line}${AIR}`;
            }
        }
        console.log(line);
    }
}

function solveProblem(filename, isEndlessCave, drawSolution = false) {
    const { minX, _minY, maxX, maxY, rocks } = parseRocks(filename);
    drawCave(rocks, [minX, 0], [maxX, maxY]);
    const totalSand = fillCave(rocks, isEndlessCave ? maxY : maxY + 2, isEndlessCave);
    if (drawSolution) {
        drawCave(rocks, [minX, 0], [maxX, maxY]);
    }
    return totalSand;
}

function solveProblem1(filename) {
    const answer = solveProblem(filename, true, true);
    writeAnswer(answer);
}

function solveProblem2(filename) {
    const answer = solveProblem(filename, false, true);
    writeAnswer(answer, 2);
}

const filename = './day14.sample.txt';
// const filename = './day14.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);
