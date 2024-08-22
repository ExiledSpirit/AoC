const fs = require('node:fs');

let data;

try {
    data = fs.readFileSync('./input.txt', 'utf-8');
} catch (err) {
    console.error(err);
    throw err;
}

process.stdout.write(data);

// processing input into grid
const grid = data
            .split('\n')
            .map(line => line.trim())
            .map(line => line.split(''));

const GRID_X = grid.length;
const GRID_Y = grid[0].length;

let rowsToExpand = [];
let colsToExpand = [];

for (let x = 0; x < GRID_X; x++) {
    let hasGalaxyRow = false;
    let hasGalaxyCol = false;

    for (let y = 0; y < GRID_Y; y++) {
        if (grid[x][y] == '#') hasGalaxyRow = true;
        if (grid[y][x] == '#') hasGalaxyCol = true;
    }
    if (!hasGalaxyRow) rowsToExpand.push(x);
    if (!hasGalaxyCol) colsToExpand.push(x);
}

const MAX_X = GRID_X + rowsToExpand.length;
const MAX_Y = GRID_Y + colsToExpand.length;

const galaxyList = [];
const expandedGrid = Array.from({ length: MAX_X }, () => Array(MAX_Y).fill('.'));

let rowCount = 0;

for (let x = 0; x < GRID_X; x++) {
    if (rowsToExpand.includes(x)) rowCount++;
    
    let colCount = 0;
    for (let y = 0; y < GRID_Y; y++) {
        if (colsToExpand.includes(y)) colCount++;
        expandedGrid[x+rowCount][y+colCount] = grid[x][y];
        if (grid[x][y] == '#') galaxyList.push([x+rowCount, y+colCount]);
    }
}

function galaxyDistanceSum(galaxySet) {
    let totalSum = 0;
    let totalPairs = 0;
    for (let x = 0; x < galaxySet.length; x++) {
        const xGalaxy = galaxySet[x];
        for (let y = x + 1; y < galaxySet.length; y++) {
            totalPairs++;
            const yGalaxy = galaxySet[y];
            const xDistance = yGalaxy[0] - xGalaxy[0];
            const yDistance = yGalaxy[1] > xGalaxy[1] ? yGalaxy[1] - xGalaxy[1] : xGalaxy[1] - yGalaxy[1];
            const xySum = xDistance + yDistance;
            totalSum += xySum;
        }
    }
    console.log(totalPairs)
    return totalSum;
}

console.log(galaxyDistanceSum(galaxyList));

function printGrid(gridArray) {
    const MAX_I = gridArray.length;
    const MAX_J = gridArray[0].length;

    for (let x = 0; x < MAX_I; x++) {
        process.stdout.write(`${x}: `);
        for (let y = 0; y < MAX_J; y++) {
            process.stdout.write(gridArray[x][y]);
        }
        process.stdout.write('\n');
    }
}

// Pair combinations = n * (n - 1) / 2
