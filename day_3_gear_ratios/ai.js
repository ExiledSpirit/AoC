const data = process.argv[2];

if (typeof data !== `string`) throw new Error('Error reading the data');

const lineList = data.split('\n');
const MAX_X = lineList.length;
const MAX_Y = lineList[0].length;

console.log(MAX_X);
console.log(MAX_Y);

const grid = new Array(MAX_X).fill(null).map(() => new Array(MAX_Y).fill(null));

let incompleteNumber = '';

for (let i = 0; i < MAX_X; i++) {
  for (let k = 0; k < MAX_Y; k++) {
    const char = lineList[i].charAt(k);
    if (isNaN(char)) {
      insertNumberIntoArrayIfHasValue(i, k);
      addItemIntoArray(i, k, `${i}-${k}`, 'symbol', char, false);
    } else {
      incompleteNumber += char;
    }
  }
  insertNumberIntoArrayIfHasValue(i, MAX_Y); // Handle incomplete number at the end of the line
}

for (let i = 0; i < MAX_X; i++) {
  for (let k = 0; k < MAX_Y; k++) {
    if (grid[i][k]?.type === 'symbol' && grid[i][k]?.value !== '.') {
      turnAdjacentsOn(i, k);
    }
  }
}

const usedIds = [];
let sum = 0;

for (let i = 0; i < MAX_X; i++) {
  for (let k = 0; k < MAX_Y; k++) {
    if (grid[i][k] && !usedIds.includes(grid[i][k]?.id)) {
      const adjacent = grid[i].some((item) => item?.id === grid[i][k]?.id && item?.adjacent);
      usedIds.push(grid[i][k].id);

      if (adjacent) {
        sum += grid[i][k].value;
      }
    }
  }
}

console.log(sum);

function insertNumberIntoArrayIfHasValue(i, k) {
  if (incompleteNumber !== '') {
    let iValue = i;
    let kValue = k;
    if (k === 0) {
      iValue = i - 1;
      kValue = MAX_Y;
    }

    for (let j = 0; j < incompleteNumber.length; j++) {
      const id = `${iValue}-${kValue - 1}`;
      addItemIntoArray(iValue, kValue - (j + 1), id, 'number', parseInt(incompleteNumber), false);
    }

    incompleteNumber = '';
  }
}

function addItemIntoArray(i, k, id, type, value, adjacent = false, invalid = false) {
  grid[i][k] = { id, type, value, adjacent, invalid };
}

function turnAdjacentsOn(i, k) {
  // Check right
  if (k < MAX_Y - 1 && grid[i][k + 1]?.type === 'number') {
    grid[i][k + 1].adjacent = true;
  }
  // Check left
  if (k > 0 && grid[i][k - 1]?.type === 'number') {
    grid[i][k - 1].adjacent = true;
  }
  // Check down
  if (i < MAX_X - 1 && grid[i + 1][k]?.type === 'number') {
    grid[i + 1][k].adjacent = true;
  }
  // Check up
  if (i > 0 && grid[i - 1][k]?.type === 'number') {
    grid[i - 1][k].adjacent = true;
  }
  // Check down-right diagonal
  if (i < MAX_X - 1 && k < MAX_Y - 1 && grid[i + 1][k + 1]?.type === 'number') {
    grid[i + 1][k + 1].adjacent = true;
  }
  // Check up-right diagonal
  if (i > 0 && k < MAX_Y - 1 && grid[i - 1][k + 1]?.type === 'number') {
    grid[i - 1][k + 1].adjacent = true;
  }
  // Check down-left diagonal
  if (i < MAX_X - 1 && k > 0 && grid[i + 1][k - 1]?.type === 'number') {
    grid[i + 1][k - 1].adjacent = true;
  }
  // Check up-left diagonal
  if (i > 0 && k > 0 && grid[i - 1][k - 1]?.type === 'number') {
    grid[i - 1][k - 1].adjacent = true;
  }
}