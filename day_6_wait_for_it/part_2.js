// Reading the data
const fs = require('node:fs');

let data;

try {
  data = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

const BOAT_SPEED = 1; // millimeter per milliseconds 
const timeSet = data.split('\r\n')[0].trim().replace(/\s+/g, ' ').split(': ')[1].split(' ');
const newTimeSet = [timeSet.reduce((acc, time) => acc + time, '')]
const distanceSet = data.split('\r\n')[1].trim().replace(/\s+/g, ' ').split(': ')[1].split(' ');
const newDistanceSet = [distanceSet.reduce((acc, time) => acc + time, '')];

console.log(newTimeSet.reduce((acc, time, index) => {
  return (acc * calculateResultPartOne(parseInt(time), parseInt(newDistanceSet[index])));
}, 1))

function calculateResultPartOne(time, highScore) {
  const optimizedButtonHoldTime = calculateOptimizedButtonHoldTime(time);

  const distanceTravelled = ((optimizedButtonHoldTime * BOAT_SPEED) * (time - optimizedButtonHoldTime))
  
  const resolution = resolveQuadraticFormula(highScore, time);
  console.log('quadratic formular resolution: ', resolution);

  const nthTerm = ((resolveQuadraticFormula(highScore, time) - 1) - Math.floor(time/2));
  console.log('nth term: ', nthTerm);

  console.log('distanceTravelled', distanceTravelled)
  console.log('time: ', time + 1)
  console.log('time mod 2: ', (time + 1) % 2)
  const result = (nthTerm * 2) + ((time + 1) % 2);
  console.log(result)

  return result;
}

function resolveQuadraticFormula(value, time) {
  return Math.floor(((time * -1) - Math.sqrt(((time * -1)**2) - (4 * value))) / 2) * -1
}

function calculateOptimizedButtonHoldTime(raceTimer) {
  return Math.ceil(raceTimer / 2);
}
