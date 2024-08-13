// Reading the data
const fs = require('node:fs');

let data;

try {
  data = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

// Converts input into a 2D array. The first Dimension representing the rows and the second the value changing history.
const historyPerRow = data.split('\r\n').map((row) => row.split(' ').map((history) => parseInt(history)));
console.log(historyPerRow)
console.log(data)
console.log(historyPerRow.reduce((acc, row) => acc + calculateNextValue(row), 0))

function calculateNextValue(row) {
  const differenceRowList = [row];

  while(differenceRowList[differenceRowList.length - 1].some((row) => row !== 0)) {
    const differenceRow = getDifferenceProduct(differenceRowList[differenceRowList.length - 1]);
    differenceRowList.push(differenceRow);
  }

  differenceRowList[differenceRowList.length - 1].push(0)

  for (let i = differenceRowList.length - 1; i > 0; i--) {
    const currentRow = differenceRowList[i];
    const nextRow = differenceRowList[i - 1];

    nextRow.push(nextRow[0] - currentRow[currentRow.length - 1]);
  }
  
  return differenceRowList[0][differenceRowList[0].length - 1]
}

function getDifferenceProduct(row) {
  const differenceArray = []

  for (let i = 0; i < row.length - 1; i++) {
    differenceArray.push(row[i + 1] - row[i]);
  }
  
  return differenceArray
}
