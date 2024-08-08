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
const seeds = mapStringList[0].split(': ')[1].split(' ').map((seed) => parseInt(seed));

const mapList = [];
populateMapList(mapList);

const locationsSorted = seeds.map(seedToLocation).sort((mapValueA, mapValueB) => mapValueA[mapValueA.length - 1] - mapValueB[mapValueB.length - 1]);
console.log(locationsSorted[0][locationsSorted[0].length - 1])

function seedToLocation(seed) {
  const seedMappingArray = new Array(mapList.length + 1).fill(null);
  seedMappingArray[0] = seed

  for (let i = 0; i < mapList.length; i++) {
    for (let k = 0; k < mapList[i]?.length; k++) {
      const row = mapList[i][k];
      const lastMappedValue = seedMappingArray[i]

      if (lastMappedValue >= row[1] && lastMappedValue < row[1] + row[2])
        seedMappingArray[i + 1] = row[0] + lastMappedValue - row[1];
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
