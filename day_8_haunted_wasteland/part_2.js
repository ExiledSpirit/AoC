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

const instructionsMap = new Map();

instructions.forEach((instruction) => {
  const chave = instruction.split(' = ')[0];
  const leftRightKeys = instruction.split(' = ')[1].replace('(', '').replace(')', '').split(', ')
  instructionsMap.set(chave, {L: leftRightKeys[0], R: leftRightKeys[1]});
})

console.log(fromAtoZ(directions, instructionsMap));

function fromAtoZ(directions, instructionMap) {
  const initialNodes = getAllInitialNodes(instructionMap); // [ 'SLA', 'AAA', 'LVA', 'NPA', 'GDA', 'RCA' ]

  const currentNodes = [...initialNodes];

  const nodeLaps = currentNodes.map((node) => fromAnyNodeToZ(directions, instructionMap, node)); // [ 11653, 19783, 19241, 16531, 12737, 14363 ]

  return nodeLaps.reduce((acc, val) => lcm(acc, val)); // retorna o minimo multiplo comum para saber quando todos os nodes vao terminar com Z.
}

function fromAnyNodeToZ(directions, instructionMap, node) {
  let currentPoint = node;
  let count = 0;
  
  while(currentPoint[2] !== 'Z') {
    const directionIndex = count % directions.length;
    const currentPointObject = instructionMap.get(currentPoint);
    currentPoint = currentPointObject[directions[directionIndex]];
    count++;
  }

  return count;
}

function getAllInitialNodes(instructionMap) {
  return [...instructionMap.keys()].filter((key) => key[2] === 'A')
}

function gcd(a, b) {
  while (b) {
    const originalA = a;
    a = b;
    b = originalA % b;
  }

  return a;
}

function lcm(a, b) {
  return  Math.floor(a * b / gcd(a, b));
}
