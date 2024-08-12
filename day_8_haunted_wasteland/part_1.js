// Reading the data
const fs = require('node:fs');

let data;

try {
  data = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

const directions = data.split('\r\n\r\n')[0].split('');
const instructions = data.split('\r\n\r\n')[1].split('\r\n');

console.log(directions)
console.log(instructions)

const instructionsMap = new Map();

instructions.forEach((instruction) => {
  const chave = instruction.split(' = ')[0];
  const leftRightKeys = instruction.split(' = ')[1].replace('(', '').replace(')', '').split(', ')
  instructionsMap.set(chave, {L: leftRightKeys[0], R: leftRightKeys[1]});
})

console.log(instructionsMap)
console.log(instructionsMap.get('AAA'))
fromAtoZ(directions, instructionsMap)

function fromAtoZ(directions, instructionMap) {
  let currentPoint = 'AAA';
  let count = 0;
  
  while(currentPoint !== 'ZZZ') {
    const directionIndex = count % directions.length;
    const currentPointObject = instructionMap.get(currentPoint);
    currentPoint = currentPointObject[directions[directionIndex]];
    count++;
  }

  console.log(count)
}
