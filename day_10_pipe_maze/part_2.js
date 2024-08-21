// Reading the data
const fs = require('node:fs');

let input;

try {
  input = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

// Reading and processing the input data
let data = input.split('\n').map(line => line.trim());

// Assuming 'DATA' is similar to some predefined or hardcoded data
// data = DATA.split('\n').map(line => line.trim());

let grid = data.map(line => line.split(''));

const MAX_X = grid.length;
const MAX_Y = grid[0].length;

// Finding the start position 'S'
let start = null;
grid.forEach((row, x) => {
  row.forEach((cell, y) => {
    if (cell === 'S') {
      start = [x, y];
    }
  });
});
console.log(start);

// Direction mappings
const DIRS = {
  "J": [[-1, 0], [0, -1]],
  "L": [[-1, 0], [0, 1]],
  "7": [[0, -1], [1, 0]],
  "F": [[0, 1],  [1, 0]],
  "|": [[-1, 0], [1, 0]],
  "-": [[0, -1], [0, 1]],
  ".": [],
  "S": []
};

// Function to get neighbors based on the pipe direction
function neighbors(grid, point) {
  let [x, y] = point;
  let pipe = grid[x][y];
  return DIRS[pipe].map(([dx, dy]) => [x + dx, y + dy]);
}

// Finding start exits
let start_exits = [];

[[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
  let s_neighbor = [start[0] + dx, start[1] + dy];
  if (neighbors(grid, s_neighbor).some(([nx, ny]) => nx === start[0] && ny === start[1])) {
    start_exits.push(s_neighbor);
  }
});

let start_point = start_exits[0];
let pipe = new Set([JSON.stringify(start), JSON.stringify(start_point)]);

while (JSON.stringify(start_point) !== JSON.stringify(start_exits[start_exits.length - 1])) {
  let ns = neighbors(grid, start_point);
  ns.forEach(neighbor => {
    if (!pipe.has(JSON.stringify(neighbor))) {
      pipe.add(JSON.stringify(neighbor));
      start_point = neighbor;
    }
  });
}
console.log(`Part 1, ${pipe.size / 2}`);

// Creating and filling the clean grid
let clean_grid = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(' '));

pipe.forEach(coordStr => {
  let [x, y] = JSON.parse(coordStr);
  clean_grid[x][y] = grid[x][y];
});

// Counting inside cells
let inside_cells = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
let inside = 0;

clean_grid.forEach((row, x) => {
  process.stdout.write(`${x}: `);
  row.forEach((cell, y) => {
    process.stdout.write(cell);

    // Skip cells on the pipeline
    if (pipe.has(JSON.stringify([x, y]))) return;

    let north = 0;
    let south = 0;

    for (let y2 = y; y2 < row.length; y2++) {
      // Count north facing blockers (hacked S!)
      if (["J", "L", "|", "S"].includes(clean_grid[x][y2])) {
        north += 1;
      }

      // Count south facing blockers (hacked S!)
      if (["F", "7", "|", "S"].includes(clean_grid[x][y2])) {
        south += 1;
      }
    }

    if (Math.min(north, south) % 2 === 1) {
      inside += 1;
      inside_cells[x][y] = grid[x][y];
    }
  });
  process.stdout.write("$\n");
});

console.log(inside);

for (let x = 0; x < MAX_X; x++) {
  for (let y = 0; y < MAX_Y; y++) {
    let inLoop = false; 
    pipe.forEach((coordStr) => {
      let [xI, yI] = JSON.parse(coordStr);
      if (xI == x && yI == y) inLoop = true;
    });

    let inside = !!inside_cells[x][y];
    process.stdout.write(`${inLoop ? '\x1b[32m' : inside ? '\x1b[33m' : '\x1b[30m'}` + grid[x][y]);
  }
  process.stdout.write('\r\n');
}
