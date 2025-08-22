const fs = require('node:fs');

let data;

try {
    data = fs.readFileSync('./sample.txt', 'utf-8');
} catch (err) {
    console.error(err);
    throw err;
}

// process.stdout.write(data);

let linesArray = data.split('\n')

const DAMAGED = '#';
const REGULAR = '.';
const UNKNOWN = '?';

/**
 * springsList: '#' | '.' | '?'[]
 * damagedSpringsGroup: int[]
 */
linesArray = linesArray.map((line, index) => {
    const splitedString = line.split(' ');
    splitedString[0] = splitedString[0].concat('?' + splitedString[0])
    splitedString[0] = splitedString[0].concat('?' + splitedString[0])
    splitedString[0] = splitedString[0].concat('?' + splitedString[0])
    splitedString[0] = splitedString[0].concat('?' + splitedString[0])
    
    splitedString[1] = splitedString[1].concat(',' + splitedString[1])
    splitedString[1] = splitedString[1].concat(',' + splitedString[1])
    splitedString[1] = splitedString[1].concat(',' + splitedString[1])
    splitedString[1] = splitedString[1].concat(',' + splitedString[1])

    const springsList = splitedString[0].split('');

    const damagedSpringsGroup = splitedString[1].split(',').map((group) => parseInt(group));
    return {
        springsList,
        damagedSpringsGroup
    }
})

console.log(linesArray);

// SOLUTION

// Return integer (>= 0)
function solve(springsList, damagedSpringsGroup, currentGroup, currentGroupSize) {
    for(let i = 0; i < springsList.length; i++) {
        if (springsList[i] == UNKNOWN) {
            const newDamagedList = [...springsList.slice(i)];
            newDamagedList[0] = '#';
            const newRegularList = [...springsList.slice(i)];
            newRegularList[0] = '.';
            return solve(newDamagedList, damagedSpringsGroup, currentGroup, currentGroupSize) + solve(newRegularList, damagedSpringsGroup, currentGroup, currentGroupSize)
        } else if (springsList[i] == DAMAGED) {
            if (currentGroup >= damagedSpringsGroup.length)
                return 0;
            currentGroupSize++;
            if (currentGroupSize > damagedSpringsGroup[currentGroup])
                return 0;
        } else if (springsList[i] == REGULAR) {
            if (currentGroupSize > 0) {
                if (currentGroupSize < damagedSpringsGroup[currentGroup])
                    return 0
                currentGroup++;
                currentGroupSize = 0;
            } 
        }
    }

    if (currentGroupSize > 0) {
        if (currentGroupSize < damagedSpringsGroup[currentGroup])
            return 0
        currentGroupSize = 0;
        currentGroup++;
    }

    return currentGroup == damagedSpringsGroup.length;
}

console.log(solve(linesArray[1].springsList, linesArray[1].damagedSpringsGroup, 0, 0, 0));
// const sum = linesArray.reduce((acc, line) => acc + solve(line.springsList, line.damagedSpringsGroup, 0, 0, 0), 0);
// console.log(sum)