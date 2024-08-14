// Reading the data
const fs = require('node:fs');

let data;

try {
  data = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

const pipeMazeArray = data.split('\r\n').map((row) => row.split(''));

console.log(pipeMazeArray.length);
console.log(pipeMazeArray[0].length);
