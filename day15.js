import { parseLinesFromFile, writeAnswer } from './helpers.js';

const NUMBER_REGEX = /-?\d+/g;
function parseLine(str) {
    const matches = str.match(NUMBER_REGEX)
    const [sensorX, sensorY, beaconX, beaconY] = matches;
    return { 
        sensorX: parseInt(sensorX), 
        sensorY: parseInt(sensorY), 
        beaconX: parseInt(beaconX),
        beaconY: parseInt(beaconY), 
    };
}

function calculateManhattanDistance(startX, startY, endX, endY) {
    return Math.abs(startX-endX) + Math.abs(startY-endY);
}

function parseFile(filename) {
    return parseLinesFromFile(filename).map(line => {
        const { sensorX, sensorY, beaconX, beaconY } = parseLine(line);
        const distance = calculateManhattanDistance(sensorX, sensorY, beaconX, beaconY);
        return {
            sensor: { x: sensorX, y: sensorY },
            beacon: { x: beaconX, y: beaconY },
            distance,
        }
    });
}

function getSensorsRowCoverage(sensors, row) {
    return sensors.map(({ sensor, distance }) => getSensorCoverage(distance, sensor, row)).filter(Boolean);
}

function getSensorCoverage(distance, sensor, row) {
    const width = distance - Math.abs(sensor.y - row);
    if (width < 0) return;

    return [sensor.x - width, sensor.x + width];
}

function getDistressCoordinate(sensors, maxRow) {
    for (let y=0; y<maxRow; y++) {
        const rowCoverage = getRowCoverage(sensors, y);
        // If there is a whole in the merged coverage line then that's where the distress signal is
        if (rowCoverage.length > 1) {
            // is's the position in between the two coverage spots
            return [rowCoverage[0][1] + 1, y];
        }
    }
}

function mergeCoverage(ranges) {
    let merged = [];
    ranges.sort((a, b) => a[0] - b[0]);



    let working = ranges[0];

    for (let i=0; i<ranges.length; i++) {
        let curr = ranges[i];
        // last one overlaps the current one
        if (working[1] >= curr[0] - 1) {
            working = [working[0], Math.max(working[1], curr[1])];
        } else {
            // reached the end of a set of overlapping ranges
            merged.push(working);
            working = curr;
        }
    }

    // add last one
    merged.push(working);
    return merged;
}

function getRowCoverage(sensorData, targetRow) {
    const coverage = getSensorsRowCoverage(sensorData, targetRow);
    return mergeCoverage(coverage);
}

function getBlockedItemsInRow(merged) {
    return merged.reduce((total, [start,end]) => {
        return total + (end - start);
    }, 0);
}

function getTuningFrequency(x, y) {
    return x*4000000 + y;
}

function solveProblem1(isSample=true) {
    const filename = isSample ? './day15.sample.txt' : './day15.puzzle.txt';
    const targetRow = isSample ? 10 : 2000000;
    
    const data = parseFile(filename);
    const merged = getRowCoverage(data, targetRow);
    const answer = getBlockedItemsInRow(merged); // 0 and beacon position offset each other to make this work....
    writeAnswer(answer);
}

function solveProblem2(isSample=true) {
    const filename = isSample ? './day15.sample.txt' : './day15.puzzle.txt';
    const maxRow = isSample ? 20 : 4000000;
    
    const data = parseFile(filename);
    const coord = getDistressCoordinate(data, maxRow);
    const answer = getTuningFrequency(coord[0], coord[1]);
    writeAnswer(answer, 2);
}

solveProblem1(false);
solveProblem2(false);
