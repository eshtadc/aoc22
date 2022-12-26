import { parseLinesFromFile, writeAnswer } from './helpers.js';

const SPACE = '.';
const ELF = '#';

function parseElves(filename) {
    return parseLinesFromFile(filename).reduce((state, line, y) => {
        line.split('').reduce(({ map, elves }, char, x) => {
            if (char === ELF) {
                elves.set(`${x}_${y}`, { current: [x, y] });
                map.set(`${x}_${y}`, `${x}_${y}`);
            }
            return { map, elves };
        }, state);
        return state;
    }, { map: new Map(), elves: new Map()});
}

function hasValidMove(directions, map) {
    return !directions.some(([checkX, checkY]) => map.get(`${checkX}_${checkY}`) ?? SPACE !== SPACE);
}

function getDirections() {
    const north = [0, -1];
    const south = [0, 1];
    const west = [-1, 0];
    const east = [1, 0];
    const directions = [
        [north, south, west, east],
        [south, west, east, north],
        [west, east, north, south],
        [east, north, south, west],
    ];
    let startIndex = 0;
    return {
        next() {
            const value = directions[startIndex];
            startIndex++;
            if (startIndex >= directions.length) {
                startIndex = 0;
            }
            return {
                value,
                done: false,
            };
        },
    };
}

function getProposedMove(map, [currentX, currentY], directionChoices) {
    // const northern = [[currentX-1, currentY-1], [currentX, currentY-1], [currentX+1, currentY-1]];
    // const southern = [[currentX-1, currentY+1], [currentX, currentY+1], [currentX+1, currentY+1]];
    // const western = [[currentX-1, currentY-1], [currentX-1, currentY], [currentX-1, currentY+1]];
    // const eastern = [[currentX+1, currentY-1], [currentX+1, currentY], [currentX+1, currentY+1]];
    const directionsMoves = directionChoices.map(([adjustX, adjustY]) => {
        if (adjustX === 0) {
            return [[currentX-1, currentY + adjustY], [currentX, currentY + adjustY], [currentX+1, currentY+adjustY]];
        } else {
            return [[currentX+adjustX, currentY-1], [currentX+adjustX, currentY], [currentX+adjustX, currentY+1]];
        }
    });
    const moves = directionsMoves.filter(directions => hasValidMove(directions, map));
    if (moves.length === 4) {
        return;
    } else if (moves.length === 0) {
        return false;
    }
    return moves[0][1];
}

function getDuplicateProposals(elves) {
    const proposals = new Map();
    const duplicateElves = new Set();
    for (const [elfName, elfData] of elves) {
        if (!elfData.proposed) {
            continue;
        }
        const proposal = `${elfData.proposed[0]}_${elfData.proposed[1]}`;
        if (proposals.has(proposal)) {
            duplicateElves.add(elfName);
            duplicateElves.add(proposals.get(proposal));
        } else {
            proposals.set(proposal, elfName);
        }
    }
    return duplicateElves;
}

function proposeMoves(map, elves, directionChoices) {
    let numberMoves = 0;
    for (const [_elfName, elfData] of elves.entries()) {
        const proposedMove = getProposedMove(map, elfData.current, directionChoices);
        if (proposedMove === false) {
            continue;
        }
        elfData.proposed = proposedMove;
        if (proposedMove) {
            numberMoves++;
        }    
    }
    return numberMoves;
}

function moveElves(elves) {
    const noMove = getDuplicateProposals(elves);
    const newPositions = new Map();
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = 0;
    let maxY = 0;
    for (const [elfName, elfData] of elves) {
        let moveX, moveY;
        if (noMove.has(elfName)) {
            elfData.proposed = undefined;
        } else {
            elfData.current = elfData.proposed ?? elfData.current;
            elfData.proposed = undefined;
        }
        ([moveX, moveY] = elfData.current);
        newPositions.set(`${moveX}_${moveY}`, elfName);
        minX = Math.min(minX, moveX);
        maxX = Math.max(maxX, moveX);
        minY = Math.min(minY, moveY);
        maxY = Math.max(maxY, moveY);
    }
    return { map: newPositions, tl: [minX, minY], br: [maxX, maxY] };
}

function drawMap(map, [leftX, topY], [rightX, bottomY], label='Map') {
    console.log(`${label} ~~~~~~~~~~~~~~~~~~~~~`);
    for (let y = topY; y<= bottomY; y++) {
        let line = '';
        for (let x = leftX; x<=rightX; x++) {
            const current = map.has(`${x}_${y}`) ? ELF : SPACE;
            line = `${line}${current}`;
        }
        console.log(line);
    }
}

function simulateRound(map, elves, directions, logLabel) {
    let tl, br;
    const proposed = proposeMoves(map, elves, directions);
    ({ map, tl, br } = moveElves(elves));
    if (logLabel) {
        drawMap(map, tl, br);
    }
    return { proposed, map, tl, br };
}

function simulateRounds(starting, elves, numRounds, print=false) {
    const directionIterator = getDirections();
    let nextDirections = directionIterator.next();
    let map = starting;
    let tl, br;
    let proposed;
    for (let i=1; i<=numRounds; i++) {
        let label = print ? `Round ${i}` : undefined;
        ({ proposed, map, tl, br } = simulateRound(map, elves, nextDirections.value, label));
        if (proposed === 0) {
            return { map, tl, br, round: i};
        }
        nextDirections = directionIterator.next();
    }
    return { map, tl, br, round: numRounds };
}

function countEmptyTiles(map, [leftX, topY], [rightX, bottomY]) {
    let count = 0;
    for (let y = topY; y<= bottomY; y++) {
        for (let x = leftX; x<=rightX; x++) {
            if (!map.has(`${x}_${y}`)) {
                count++;
            }
        }
    }
    return count;
}

function solveProblem1(isSample=true) {
    console.log('Part 1');
    const filename = isSample ? `./day23.sample.txt` : './day23.puzzle.txt';
    const { map, elves } = parseElves(filename);
    if (isSample) {
        drawMap(map, [0,0], [6, 6], 'Starting Map');
    }
    const { map: finalMap, tl, br } = simulateRounds(map, elves, 10);
    const answer = countEmptyTiles(finalMap, tl, br);
    writeAnswer(answer);
}

function solveProblem2(isSample=true) {
    console.log('Part 2');
    const filename = isSample ? `./day23.sample.txt` : './day23.puzzle.txt';
    const { map, elves } = parseElves(filename);
    const { round } = simulateRounds(map, elves, Number.MAX_SAFE_INTEGER);
    writeAnswer(round, 2);
}

// solveProblem1(true);
solveProblem2(false);
