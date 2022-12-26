import { parseLinesFromFile, writeAnswer } from './helpers.js';

function snafuToDecimal(snafu) {
    const convert = snafu.split('').reverse();
    const converted = convert.reduce(({num, minus}, digit, i) => {
        const multiplier = i === 0 ? 1 : Math.pow(5, i);
        if (digit === '-') {
            return { num, minus: minus + multiplier };
        } else if (digit === '=') {
            return { num, minus: minus + 2*multiplier };
        } else {
            return { num: num + (Number(digit)*multiplier - minus), minus: 0 };
        }
    }, { num: 0, minus: 0 });
    return converted.num;
}

export function decimalToSnafu(num) {
    let exp = 0
    while (5 ** exp <= num) {
      exp += 1
    }
  
    const snafu = []
    for (let i = exp; i >= 0; i--) {
      const cur = Math.floor(num / 5 ** i)
      snafu.push(cur)
      num = num % 5 ** i
    }
  
    for (let i = snafu.length - 1; i > 0; i--) {
      if (snafu[i] === 3) {
        snafu[i] = '='
        snafu[i - 1] += 1
      } else if (snafu[i] === 4) {
        snafu[i] = '-'
        snafu[i - 1] += 1
      } else if (snafu[i] === 5) {
        snafu[i] = 0
        snafu[i - 1] += 1
      }
    }
    if (snafu[0] === 0) snafu.shift()
    return snafu.join('')
}


function tests() {
    const counterparts = [
        [1, '1'],
        [2, '2'],
        [3, '1='],
        [4, '1-'],
        [5, '10'],
        [6, '11'],
        [7, '12'],
        [8, '2='],
        [9, '2-'],
        [10, '20'],
        [15, '1=0'],
        [20, '1-0'],
        [2022, '1=11-2'],
        [4890, '2=-1=0'],
        [12345, '1-0---0'],
        [314159265, '1121-1110-1=0'],
    ];
    for (const [expected, snafu] of counterparts) {
        const matches = snafuToDecimal(snafu) === expected;
        console.log(`${snafu} matches ${expected}`, matches);
    }
}

function solveProblem1(isSample=true) {
    console.log('Part 1');
    const filename = isSample ? `./day25.sample.txt` : './day25.puzzle.txt';
    const sum = parseLinesFromFile(filename).reduce((total, snafu) => {
        return total + snafuToDecimal(snafu);
    }, 0);
    writeAnswer(decimalToSnafu(sum));
}

tests();
solveProblem1(false);
