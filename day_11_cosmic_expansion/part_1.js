const fs = require('node:fs');

let data;

try {
    data = fs.readFileSync('./sample.txt', 'utf-8');
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

let expandedGrid = Array.from({ length: GRID_X }, () => Array(GRID_Y).fill(null));
console.log(grid)
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

console.log(colsToExpand);
console.log(rowsToExpand);

// Pair combinations = n * (n - 1) / 2


