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

console.log(`char at 0`)
console.log(lineList[24].charAt(0));
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
    console.log(grid[i][k].value)
  }
  process.stdout.write('\n');
}

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
