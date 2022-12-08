import { parseLinesFromFile, writeAnswer } from './helpers.js';

function isEdge([x, y], width, height) {
    return x == 0 || y === 0 || x === width-1 || y === height-1;
}

function isVisibleFromEdge(grid, [x, y], treeHeight, updateCoordFn) {
    let [nextX, nextY] = updateCoordFn(x, y);
    let nextHeight = grid.get(getGridNum(nextX, nextY));

    while (nextHeight !== undefined) {
        if (nextHeight >= treeHeight) {
            return false;
        }
        [nextX, nextY] = updateCoordFn(nextX, nextY);
        nextHeight = grid.get(getGridNum(nextX, nextY));
    }
    return true;
}

function calculateDistanceScore(grid, [x, y], treeHeight, updateCoordFn) {
    let score = 0;
    let [nextX, nextY] = updateCoordFn(x, y);
    let nextHeight = grid.get(getGridNum(nextX, nextY));

    while (nextHeight !== undefined) {
        score++;
        if (nextHeight >= treeHeight) {
            return score;
        }
        [nextX, nextY] = updateCoordFn(nextX, nextY);
        nextHeight = grid.get(getGridNum(nextX, nextY));
    }
    return score;
}

function moveRight(x, y) {
    return [x+1, y];
}

function moveLeft(x, y) {
    return [x-1, y];
}

function moveUp(x, y) {
    return [x, y-1];
}

function moveDown(x, y) {
    return [x, y+1];
}

function isVisible(grid, coord, treeHeight, width, height) {
    if (isEdge(coord, width, height)) {
        return true;
    }
    return isVisibleFromEdge(grid, coord, treeHeight, moveUp)
        || isVisibleFromEdge(grid, coord, treeHeight, moveDown)
        || isVisibleFromEdge(grid, coord, treeHeight, moveLeft)
        || isVisibleFromEdge(grid, coord, treeHeight, moveRight)
}

function calculateScenicScore(grid, coord, treeHeight) {
    let upScore, downScore, leftScore, rightScore;
    upScore = calculateDistanceScore(grid, coord, treeHeight, moveUp);
    if (upScore === 0) return 0;
    downScore = calculateDistanceScore(grid, coord, treeHeight, moveDown);
    if (downScore === 0) return 0;
    leftScore = calculateDistanceScore(grid, coord, treeHeight, moveLeft);
    if (leftScore === 0) return 0;
    rightScore = calculateDistanceScore(grid, coord, treeHeight, moveRight);
    return upScore * downScore * leftScore * rightScore;
}

function getGridNum(x, y) {
    return `${x}_${y}`;
}

function getCoordFromGridNum(gridNum) {
    const [xstr, ystr] = gridNum.split('_')
    return [parseInt(xstr, 10), parseInt(ystr, 10)];
}

function generateGrid(input) {
    return input.reduce((map, line, y) => {
        line.split('').reduce((lineMap, height, x) => {
            lineMap.set(getGridNum(x, y), parseInt(height, 10));
            return lineMap;
        }, map);
        return map;
    }, new Map());
}

function findVisibleTrees(grid, width, height) {
    let countVisible = 0;
    grid.forEach((treeHeight, gridNum, map) => {
        const coord = getCoordFromGridNum(gridNum);
        if (isVisible(map, coord, treeHeight, width, height)) {
            countVisible++;
        }
    })
    return countVisible;
}

function findMaxScenicScore(grid) {
    let maxScore = 0;
    grid.forEach((treeHeight, gridNum, map) => {
        const coord = getCoordFromGridNum(gridNum);
        const score = calculateScenicScore(map, coord, treeHeight);
        maxScore = Math.max(maxScore, score);
    });
    return maxScore;
}

function solveProblem1(filename) {
    const input = parseLinesFromFile(filename);
    const grid = generateGrid(input);
    const width = input[0].length;
    const height = input.length;
    const answer = findVisibleTrees(grid, width, height);

    writeAnswer(answer);
}

function solveProblem2(filename) {
    const input = parseLinesFromFile(filename);
    const grid = generateGrid(input);
    const answer = findMaxScenicScore(grid);

    writeAnswer(answer, 2);
}

const filename = './day8.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);
