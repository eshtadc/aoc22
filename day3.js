import { getAlphabet, parseLinesFromFile, writeAnswer } from './helpers.js';

function buildPriorities() {
    const alphabet = getAlphabet().split('');
    return alphabet.reduce((priorities, letter, index) => {
        priorities[letter] = index + 1;
        priorities[letter.toUpperCase()] = index + 27;
        return priorities;
    }, {});
}

function findCommon(list1, list2, list3) {
    const common12 = findCommonItems(list1, list2);
    const common23 = findCommonItems(list2, list3);
    const common13 = findCommonItems(list1, list3);
    if (common12.length !== 1 || common23.length !== 1 || common13.length !== 1) {
        return findCommon(common12.join(''), common23.join(''), common13.join(''));
    } else {
        return common12[0];
    }
}

function findCommonMatches(list1, list2) {
    const regex = new RegExp(`[${list2}]`, 'g');
    return list1.match(regex);
}

function findCommonItems(list1, list2) {
    const matches = findCommonMatches(list1, list2);
    return [...new Set(matches)];
}

function findCommonItem(list1, list2) {
    const matches = findCommonMatches(list1, list2);
    return matches[0];
}

function splitRucksackIntoCompartments(sackContents) {
    const half = sackContents.length / 2;
    return [sackContents.slice(0, half), sackContents.slice(half)];
}

function solveProblem1(filename) {
    const priorityScores = buildPriorities();
    const input = parseLinesFromFile(filename);
    const priorities = input.reduce((score, rucksack) => {
        const [compartment1, compartment2] = splitRucksackIntoCompartments(rucksack);
        const commonItem = findCommonItem(compartment1, compartment2);
        return score + priorityScores[commonItem];
    }, 0);

    writeAnswer(priorities);
}

function solveProblem2(filename) {
    const priorityScores = buildPriorities();
    const input = parseLinesFromFile(filename);

    const priorities = input.reduce((score, _rucksack, index) => {
        if ((index+1) % 3 === 0) {
            const badge = findCommon(input[index], input[index-1], input[index-2]);
            return score + priorityScores[badge];
        }
        return score;
    }, 0);
    
    writeAnswer(priorities, 2);
}

const filename = './day3.puzzle.txt';
solveProblem1(filename);
solveProblem2(filename); 