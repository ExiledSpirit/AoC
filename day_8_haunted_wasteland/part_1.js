// Reading the data
const fs = require('node:fs');

let data;

try {
  data = fs.readFileSync('./sample.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

console.log(data);
