// Reading the data
const fs = require('node:fs');

let data;

try {
  data = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

// const data = process.argv[2];

if (typeof data !== `string`) throw new Error('Erro ao ler os dados');

const lineList = data.split('\n');
lineList.map((line) => {
  return line.substring(0, 140);
});

const MAX_X = lineList.length;
const MAX_Y = lineList[0].trim().length;
const usedIds = [];

const grid = new Array(MAX_X).fill(null).map(() => new Array(MAX_Y).fill(null));

let incompleteNumber = '';

for(let i = 0; i < MAX_X; i++) {
  for(let k = 0; k < MAX_Y; k++) {
    const char = lineList[i].charAt(k);

    if (isNaN(char)) {
      insertNumberIntoArrayIfHasValue(i, k);
      addItemIntoArray(i, k, `${i}-${k}`, char === '.' ? 'period' : 'symbol', char);
    } else {
      incompleteNumber += char;
      incompleteNumber.trim();
    }
  }
}

for(let i = 0; i < MAX_X; i++) {
  for(let k = 0; k < MAX_Y; k++) {
    if (grid[i][k]?.type === 'symbol') {
      calculateGearPower(grid[i][k]);
    }
  }
}

let sum = 0;

for (let i = 0; i < MAX_X; i++) {
  for (let k = 0; k < MAX_Y; k++) {
    const gear = grid[i][k];
      if (gear && gear?.type === 'symbol' && gear.value === '*' && gear.partNumbers.length === 2) {
        const power = gear?.partNumbers?.reduce((numberSum, number) => {
          if (numberSum > 0) {
            return numberSum * number.value;
          }
          return numberSum + number.value;
        }, 0) || 0;
        sum += power;
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
      addItemIntoArray(iValue, kValue - (j + 1), id, 'number', parseInt(incompleteNumber));
    }

    incompleteNumber = '';
  }
}

function addItemIntoArray(i, k, id, type, value) {
  grid[i][k] = {id, type, value, partNumbers: [], x: i, y: k};
}

function calculateGearPower(gear) {
  const i = gear.x;
  const k = gear.y;
  // Check right
  if (k < MAX_Y - 1 && grid[i][k + 1]?.type === 'number') {
    if (!usedIds.includes(grid[i][k + 1].id)) {
          gear.partNumbers.push(grid[i][k + 1]);
          usedIds.push(grid[i][k + 1].id);
    }
  }
  // Check left
  if (k > 0 && grid[i][k - 1]?.type === 'number') {
    if (!usedIds.includes(grid[i][k - 1].id)) {
      gear.partNumbers.push(grid[i][k - 1]);
      usedIds.push(grid[i][k - 1].id);
    }
  }
  // Check down
  if (i < MAX_X - 1 && grid[i + 1][k]?.type === 'number') {
    if (!usedIds.includes(grid[i + 1][k].id)) {
      gear.partNumbers.push(grid[i + 1][k]);
      usedIds.push(grid[i + 1][k].id);
    }
  }
  // Check up
  if (i > 0 && grid[i - 1][k]?.type === 'number') {
    if (!usedIds.includes(grid[i - 1][k].id)) {
      gear.partNumbers.push(grid[i - 1][k]);
      usedIds.push(grid[i - 1][k].id);
    }
  }
  
  // Check down-right diagonal
  if (i < MAX_X - 1 && k < MAX_Y - 1 && grid[i + 1][k + 1]?.type === 'number') {
    if (!usedIds.includes(grid[i + 1][k + 1].id)) {
      gear.partNumbers.push(grid[i + 1][k + 1]);
      usedIds.push(grid[i + 1][k + 1].id);
    }
  }
  // Check up-right diagonal
  if (i > 0 && k < MAX_Y - 1 && grid[i - 1][k + 1]?.type === 'number') {
    if (!usedIds.includes(grid[i - 1][k + 1].id)) {
      gear.partNumbers.push(grid[i - 1][k + 1]);
      usedIds.push(grid[i - 1][k + 1].id);
    }
  }
  // Check down-left diagonal
  if (i < MAX_X - 1 && k > 0 && grid[i + 1][k - 1]?.type === 'number') {
    if (!usedIds.includes(grid[i + 1][k - 1].id)) {
      gear.partNumbers.push(grid[i + 1][k - 1]);
      usedIds.push(grid[i + 1][k - 1].id);
    }
  }
  // Check up-left diagonal
  if (i > 0 && k > 0 && grid[i - 1][k - 1]?.type === 'number') {
    if (!usedIds.includes(grid[i - 1][k - 1].id)) {
      gear.partNumbers.push(grid[i - 1][k - 1]);
      usedIds.push(grid[i - 1][k - 1].id);
    }
  }
}
