import { parseLinesFromFile, writeAnswer } from './helpers.js';

function nextDir(currentDir, requested) {
    if (requested === '/') {
        return ['/'];
    } 
    if (requested === '..') {
        return currentDir.slice(0, currentDir.length-1);
    }
    return [...currentDir, requested];
}

function addFile(dirInfo, filename, size) {
    if (dirInfo.files.has(filename)) {
        return;
    }
    dirInfo.files.set(filename, size);
    dirInfo.size = dirInfo.size + size;
}

function addDirectory(map, dir, parentDir='') {
    if (dir === '..') {
        return;
    }
    const uniq = `${parentDir}${dir}`;
    if (map.has(uniq)) {
        return;
    }
    map.set(uniq, { dir, files: new Map(), parentDir, size: 0, children: [] });
    if (parentDir.length) {
        map.get(parentDir).children.push(uniq);
    }
}

function parseInstructions(instructions) {
    const files = new Map();
    addDirectory(files, '/', '');
    
    const state = instructions.reduce((state, instruction) => {
        const parsed = instruction.split(' ');
        if (parsed[0] === '$') {
            if (parsed[1] === 'cd') {
                const dir = parsed[2];
                state.currentDirPath = nextDir(state.currentDirPath, dir);
                state.key = state.currentDirPath.join('');
            }
        } else if (parsed[0] === 'dir') {
            addDirectory(state.files, parsed[1], state.key);
        } else {
            addFile(state.files.get(state.currentDirPath.join('')), parsed[1], parseInt(parsed[0], 10));
        }
        return state;
    }, { currentDirPath: [], files, key: '' });
    return state.files;
}

function rollupDirectorySize(dir, files) {
    const dirInfo = files.get(dir);
    if (dirInfo.children.length > 0) {
        for (let child of dirInfo.children) {
            dirInfo.size += rollupDirectorySize(child, files);
        }
    }
    return dirInfo.size;
}

function drawFilesystem(map, dir = '/', prefix = '') {
    const dirInfo = map.get(dir);
    console.log(`${prefix}${dir} (${dirInfo.size})`);
    dirInfo.files.forEach((size, filename) => {
        console.log(`${prefix}--${filename} (${size})`);
    });
    for (let childDir of dirInfo.children) {
        drawFilesystem(map, childDir, `${prefix}  `);
    }
}

function getSortedSizes(files) {
    const sizes = [...files.keys()].map(key => files.get(key).size);
    sizes.sort((a,b) => a-b);
    return sizes;
}

function solveProblem1(filename) {
    const instructions = parseLinesFromFile(filename);
    const files = parseInstructions(instructions);
    rollupDirectorySize('/', files);
    const sorted = getSortedSizes(files);

    const belowThresshold = sorted.filter(val => val < 100000)
    const answer = belowThresshold.reduce((total, cur) => total + cur, 0);
    
    writeAnswer(answer);
}

function solveProblem2(filename) {
    const instructions = parseLinesFromFile(filename);
    const files = parseInstructions(instructions);
    rollupDirectorySize('/', files);

    const usedSpace = files.get('/').size;
    const unusedSpace = 70000000 - usedSpace;
    const needToFreeUp = 30000000 - unusedSpace;

    // find the smallest directory that is greater than or equal to the space needed
    const sorted = getSortedSizes(files);
    
    for (let i=0; i<sorted.length; i++) {
        if (sorted[i] >= needToFreeUp) {
            writeAnswer(sorted[i], 2);
            return;
        }
    }
}

function drawProblem(filename) {
    const instructions = parseLinesFromFile(filename);
    const files = parseInstructions(instructions);
    rollupDirectorySize('/', files);
    drawFilesystem(files);
}

const filename = './day7.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename);
// drawProblem(filename);
