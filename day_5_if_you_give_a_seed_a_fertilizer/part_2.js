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

function seedsRangeToMinLocation() {
  const ranges = [];
  for (let i = 0; i < seeds.length; i+=2) {
    ranges.push([seeds[i], seeds[i+1]]);
  }

  ranges.sort((a, b) => a[0] - b[0]);

  const minLocationList = ranges.reduce((minLocation, seedRange) => {

    for (let i = seedRange[0]; i < (seedRange[0] + seedRange[1]); i++) {
      const location = seedToLocation(i);

      if (location < minLocation) minLocation = location
    }

    console.log(minLocation);
    return minLocation
  }, 100000000000000)

  return minLocationList;
}

function seedToLocation(seed, debug = false) {
  const seedMappingArray = new Array(mapList.length + 1).fill(null);
  seedMappingArray[0] = seed

  for (let i = 0; i < mapList.length; i++) {
    let listLength = mapList[i].length - 1 ;
    let low = 0;
    let high = listLength;
    
    const binarySearchResult = recursiveFunction(mapList[i], seedMappingArray[i], low, high, debug, 0);

    if (binarySearchResult !== null) {
      seedMappingArray[i + 1] = binarySearchResult;
    } else {
      seedMappingArray[i + 1] = seedMappingArray[i];
    }
  }

  return seedMappingArray[seedMappingArray.length - 1];
}

function recursiveFunction(arr, x, start, end, debug = false, count = 0) {
  if (debug) {
    console.log('start');
    console.log('count: ', count)
    console.log('start: ', start);
    console.log('end: ', end);
  }
  // Base Condition
  if (start > end) return x;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);
  if (debug)
  console.log('mid: ', mid)

  const row = arr[mid];

  const startRange = row[1];
  const endRange = row[1] + row[2];

  if (debug) {
    console.log('ranges')
    console.log('x: ', x)
    console.log('startRange: ', startRange)
    console.log('endRange: ', endRange)
  }

  // If element at mid is greater than x,
  // search in the left half of mid
  if (x >= endRange)
    return recursiveFunction(arr, x, mid + 1, end, debug, ++count);

  if (x < startRange)
    // If element at mid is smaller than x,
    // search in the right half of mid
    return recursiveFunction(arr, x, start, mid - 1, debug, ++count);

  if(debug) console.log('result: ', x + row[0] - startRange)
  return x + row[0] - startRange;
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
