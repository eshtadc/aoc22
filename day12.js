import { getAlphabet, parseLinesFromFile, writeAnswer } from './helpers.js';

const ELEVATIONS = getAlphabet().split('');

function getGridKey(x, y) {
    return `${x}_${y}`;
}

function getCoordFromKey(key) {
    return key.split('_').map(i => parseInt(i, 10));
}

function getNeighbors([x, y], grid, visited) {
    const gridKeys = [
        getGridKey(x+1, y),
        getGridKey(x-1, y),
        getGridKey(x, y+1),
        getGridKey(x, y-1),
    ];
    return gridKeys.filter(key => {
        return grid.has(key) && !visited.has(key);
    });
}

function isValidPath(current, potential) {
    return current === 'S' || ELEVATIONS.indexOf(potential) <= ELEVATIONS.indexOf(current)+1;
}

function explore(grid, start) {
    const queue = [{
        key: start,
        coord: getCoordFromKey(start),
        path: 0,
        elevation: grid.get(start),
    }];
    const visited = new Map();
    while (queue.length > 0) {
        const current = queue.shift();
        const potential = getNeighbors(current.coord, grid, visited);
        for (const key of potential) {
            const testElevation = grid.get(key);
            if (isValidPath(current.elevation, testElevation === 'E' ? 'z' : testElevation)) {
                if (testElevation === 'E') {
                    return current.path + 1;
                }
                queue.push({
                    key,
                    coord: getCoordFromKey(key),
                    path: current.path + 1,
                    elevation: testElevation,
                })
                visited.set(key, true);
            }
        };
    }
}

function parseGrid(filename, startingElevations = ['S']) {
    return parseLinesFromFile(filename).reduce((outerState, line, y) => {
        line.split('').reduce((state, loc, x) => {
            let key = getGridKey(x, y);
            state.grid.set(key, loc);
            if (startingElevations.includes(loc)) {
                state.starts.push(key);
            }
            return state;
        }, outerState);
        return outerState;
    }, { starts: [], grid: new Map() });
}

function solveProblem1(filename) {
    const { starts, grid } = parseGrid(filename);
    const pathSteps = explore(grid, starts[0]);
    writeAnswer(pathSteps);
}

function solveProblem2(filename) {
    const { starts, grid } = parseGrid(filename, ['S', 'a']);
    const pathLengths = starts.map(start => explore(grid, start));
    pathLengths.sort((a, b) => a - b);
    writeAnswer(pathLengths[0], 2);
}

// const filename = './day12.sample.txt';
const filename = './day12.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);
