// // Reading the data
// const fs = require('node:fs');

// let data;

// try {
//   data = fs.readFileSync('./input_2.txt', 'utf8');
// } catch (err) {
//   console.error(err);
//   throw err;
// }

const data = process.argv[2];

if (typeof data !== `string`) throw new Error('Erro ao ler os dados');

const lineList = data.split('\n');
lineList.map((line) => {
  return line.substring(0, 140);
});

const MAX_X = lineList.length;
const MAX_Y = lineList[0].length;
console.log(MAX_X)
console.log(MAX_Y)

const grid = new Array(MAX_X).fill(null).map(() => new Array(MAX_Y).fill(null));

let incompleteNumber = '';

for(let i = 0; i < MAX_X; i++) {
  for(let k = 0; k < MAX_Y; k++) {
    const char = lineList[i].charAt(k);
    
    if (isNaN(char)) {
      insertNumberIntoArrayIfHasValue(i, k);
      if (char !== '.') 
        addItemIntoArray(i, k, `${i}-${k}`, 'symbol', char);
    } else {
      incompleteNumber += char;
      incompleteNumber.trim();
    }
  }
}

for(let i = 0; i < MAX_X; i++) {
  for(let k = 0; k < MAX_Y; k++) {
    if (grid[i][k]?.type === 'symbol') {
      turnAdjacentsOn(i, k);
    }
  }
}

const usedIds = [];
let sum = 0;

for (let i = 0; i < MAX_X; i++) {
  for (let k = 0; k < MAX_Y; k++) {
      if (grid[i][k] !== undefined && grid[i][k] !== null && grid[i][k].adjacent === true && grid[i][k].type === 'number' && !(usedIds.includes(grid[i][k].id))) {
          sum = sum + grid[i][k].value;
          usedIds.push(grid[i][k].id);
      }
  }
}

console.log(sum);

function insertNumberIntoArrayIfHasValue(i, k) {
  if (incompleteNumber != '') {
    let iValue = i;
    let kValue = k;
    if (k === 0 ) {
        iValue = i - 1;
        kValue = MAX_Y;
    }

    for (let j = 0; j < incompleteNumber.length; j++) {
      const id = `${iValue}-${kValue-1}`;
      addItemIntoArray(iValue, kValue - (j + 1), id, 'number', parseInt(incompleteNumber), false);
    }

    incompleteNumber = '';
  }
}

function addItemIntoArray(i, k, id, type, value, adjacent = false) {
  grid[i][k] = {id, type, value, adjacent};
}

function turnAdjacentsOn(i, k) {
  // if (grid[i][k + 1] !== null && grid[i][k + 1] !== undefined)
  if (grid[i][k + 1])
    grid[i][k + 1].adjacent = true
  // if (k != 0 && grid[i][k - 1] !== null && grid[i][k - 1] !== undefined)
  if (grid[i][k - 1])
    grid[i][k - 1].adjacent = true
  // if (i != MAX_X - 1 && grid[i + 1][k] !== null && grid[i + 1][k] !== undefined)
  if (grid[i + 1][k])
    grid[i + 1][k].adjacent = true
  // if (i != 0 && grid[i - 1][k] !== null && grid[i - 1][k] !== undefined)
  if (grid[i - 1][k])
    grid[i - 1][k].adjacent = true

  // Diagonal
  // if (i != MAX_X - 1 && k != MAX_Y - 1 && grid[i + 1][k + 1] !== null && grid[i + 1][k + 1] !== undefined)
  if (grid[i + 1][k + 1])
    grid[i + 1][k + 1].adjacent = true
  // if (i != 0 && k != MAX_X - 1 && grid[i - 1][k + 1] !== null && grid[i - 1][k + 1] !== undefined)
  if (grid[i - 1][k + 1])
    grid[i - 1][k + 1].adjacent = true
  // if (i != MAX_X - 1 && k != 0 && grid[i + 1][k - 1] !== null && grid[i + 1][k - 1] !== undefined)
  if (grid[i + 1][k - 1])
    grid[i + 1][k - 1].adjacent = true
  // if (k != 0 && i != 0 && grid[i - 1][k - 1] !== null && grid[i - 1][k - 1] !== undefined)
  if (grid[i - 1][k - 1])
    grid[i - 1][k - 1].adjacent = true
}
