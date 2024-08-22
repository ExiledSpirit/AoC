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
const GALAXY_EXPANSION_SPEED = 1000000;

const galaxyList = [];
const expandedGrid = Array.from({ length: MAX_X }, () => Array(MAX_Y).fill('.'));

let rowCount = 0;

for (let x = 0; x < GRID_X; x++) {
    if (rowsToExpand.includes(x)) rowCount++;
    
    let colCount = 0;
    for (let y = 0; y < GRID_Y; y++) {
        if (colsToExpand.includes(y)) colCount++;
        expandedGrid[x+rowCount][y+colCount] = grid[x][y];
        if (grid[x][y] == '#') galaxyList.push([x, y]);
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
            const greatestX = yGalaxy[0];
            const smallestX = xGalaxy[0];
            const greatestY = xGalaxy[1] > yGalaxy[1] ? xGalaxy[1] : yGalaxy[1];
            const smallestY = xGalaxy[1] > yGalaxy[1] ? yGalaxy[1] : xGalaxy[1];

            const xDistance = greatestX - smallestX + rowsToExpand.filter((row) => row > smallestX && row < greatestX).length * (GALAXY_EXPANSION_SPEED - 1);
            const yDistance = greatestY - smallestY + colsToExpand.filter((col) => col > smallestY && col < greatestY).length * (GALAXY_EXPANSION_SPEED - 1);
            const xySum = xDistance + yDistance;
            totalSum += xySum;
        }
    }
    console.log(totalPairs)
    return totalSum;
}

console.log(galaxyDistanceSum(galaxyList));

// Pair combinations = n * (n - 1) / 2
