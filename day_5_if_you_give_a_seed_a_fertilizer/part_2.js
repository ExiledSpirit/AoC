// Reading the data
const fs = require('node:fs');

let data;

try {
  data = fs.readFileSync('./input.txt', 'utf8');
} catch (err) {
  console.error(err);
  throw err;
}

const mapStringList = data.split(`\r\n\r\n`);

const mapList = [];
const seeds = [];

parseSeedList(seeds);
populateMapList(mapList);

const minLocationList = seedsRangeToMinLocation();

console.log(minLocationList)


const locationsSorted = minLocationList.sort((mapValueA, mapValueB) => mapValueA - mapValueB);
console.log(locationsSorted[0])

function seedsRangeToMinLocation() {
  const ranges = [];
  for (let i = 0; i < seeds.length; i+=2) {
    ranges.push([seeds[i], seeds[i+1]]);
  }

  ranges.sort((a, b) => a[0] - b[0]);

  const minLocationList = ranges.reduce((minLocation, seedRange) => {
    let min = null;

    console.log(seedRange);
    for (let i = seedRange[0]; i < (seedRange[0] + seedRange[1]); i++) {
      const location = seedToLocation(i);
      if (location < min || min === null) min = location
    }

    if (min < minLocation || minLocation === null) return min
    
    console.log(minLocation);
    return minLocation
  }, null)

  return minLocationList;
}

function seedToLocation(seed) {
  const seedMappingArray = new Array(mapList.length + 1).fill(null);
  seedMappingArray[0] = seed

  for (let i = 0; i < mapList.length; i++) {
    for (let k = 0; k < mapList[i]?.length; k++) {
      const row = mapList[i][k];
      const lastMappedValue = seedMappingArray[i]

      if (lastMappedValue >= row[1] && lastMappedValue < row[1] + row[2]) {
        seedMappingArray[i + 1] = row[0] + lastMappedValue - row[1];
        break;
      }
    }

    if (seedMappingArray[i + 1] === null)
      seedMappingArray[i + 1] = seedMappingArray[i];
  }

  return seedMappingArray;
}

function populateMapList(listToPopulate) {
  for (let i = 1; i < mapStringList.length; i++) {
    let rowList = mapStringList[i]
      .split(':\r\n')[1] // Removes title:
      .split('\r\n') // Split into a list of rows
      .map((row) => row.split(' ') // Maps each row from a string to a list of string, resulting in a 2d array
        .map((seed) => parseInt(seed)) // Convert each position of the new list of string into integer, thus giving us a list of numbers.
      )

    rowList.sort((rowA, rowB) => rowA[1] - rowB[1])// Sorts the rows from each list from the lowest to the highest ranges so we can optimize our logic.
  
    listToPopulate.push(rowList);
  }
}

function parseSeedList(seedList) {
  seedList.push(...mapStringList[0].split(': ')[1].split(' ').map((seed) => parseInt(seed)))
}
