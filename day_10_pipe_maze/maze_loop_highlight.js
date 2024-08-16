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

const MAX_X = pipeMazeArray.length;
const MAX_Y = pipeMazeArray[0].length;

console.log(pipeMazeArray.length);
console.log(pipeMazeArray[0].length);

const PIPE_MAP = {
  'F': { 
    exitA: {
      x: 0,
      y: 1
    },
    exitB: {
      x: 1,
      y: 0
    }
  },
  '7': { 
    exitA: {
      x: 0,
      y: -1
    },
    exitB: {
      x: 1,
      y: 0
    }
  },
  'J': { 
    exitA: {
      x: 0,
      y: -1
    },
    exitB: {
      x: -1,
      y: 0
    }
  },
  '|': { 
    exitA: {
      x: -1,
      y: 0
    },
    exitB: {
      x: 1,
      y: 0
    }
  },
  'L': { 
    exitA: {
      x: 0,
      y: 1
    },
    exitB: {
      x: -1,
      y: 0
    }
  },
  '-': { 
    exitA: {
      x: 0,
      y: -1
    },
    exitB: {
      x: 0,
      y: 1
    }
  }
}

const loopPoint = [];
const loopOutline = [];

const startingPoint = getStartingPoint(pipeMazeArray);

const { pipeA, pipeB } = getStartingPipes(pipeMazeArray, startingPoint)

let currentPipe = {x: pipeA.x, y: pipeA.y};
let previousPipe = {x: startingPoint.x, y: startingPoint.y};

const loopLength = getLoopLength(pipeMazeArray, currentPipe, previousPipe);

for (let x = 0; x < MAX_X; x++) {
  for (let y =  0; y < MAX_Y; y++) {
    if (!loopPoint.some((item) => item.x == x && item.y == y)) continue;
    loopOutline.push({x, y})
    break;
  }
  for (let y =  MAX_Y - 1; y >= 0; y--) {
    if (!loopPoint.some((item) => item.x == x && item.y == y)) continue;
    loopOutline.push({x, y})
    break;
  }
}

for (let y = 0; y < MAX_Y; y++) {
  for (let x =  0; x < MAX_X; x++) {
    if (!loopPoint.some((item) => item.x == x && item.y == y)) continue;
    loopOutline.push({x, y})
    break;
  }
  
  for (let x =  MAX_X - 1; x >= 0; x--) {
    if (!loopPoint.some((item) => item.x == x && item.y == y)) continue;
    loopOutline.push({x, y})
    break;
  }
}

const newArray = [];

for (let x = 0; x < MAX_X; x++) {
  for (let y = 0; y < MAX_Y; y++) {
    const some = loopPoint.some((point) => point.x == x && point.y == y)
    if (some)
      newArray.push({x, y});
  }
}

console.log(newArray)

let countWithin = 0;
for (let x = 0; x < MAX_X; x++) {
  for (let y = 0; y < MAX_Y; y++) {
    const inLoop1 = loopPoint.some((point) => {
      return point.x == x && point.y == y
    })
    const inLoop = loopOutline.some((item) => item.x == x && item.y == y)
    const inside = checkPointInPolygon({x, y}, newArray);

    process.stdout.write(`${inLoop ? '\x1b[31m' : inLoop1 ? '\x1b[32m' : inside ? '\x1b[33m' : '\x1b[30m'}` + pipeMazeArray[x][y]);
  }
  process.stdout.write('\r\n');
}
console.log(Math.ceil(loopLength/2))
console.log(countWithin)

function getLoopLength(maze, currentPipe, previousPipe) {
  let count = 0;
  while (maze[currentPipe.x][currentPipe.y] != 'S') {
    loopPoint.push({x: currentPipe.x, y: currentPipe.y});
    count++;
    const currentPipeChar = maze[currentPipe.x][currentPipe.y]
    const previousPipeHolder = previousPipe;
    const {exitA, exitB} = PIPE_MAP[currentPipeChar]
    // console.log(currentPipeChar)
    let nextX = currentPipe.x + exitA.x;
    let nextY = currentPipe.y + exitA.y;

    if (nextX == previousPipeHolder.x && nextY == previousPipeHolder.y){
      nextX = currentPipe.x + exitB.x;
      nextY = currentPipe.y + exitB.y;
    }

    previousPipe = currentPipe;
    currentPipe = {x: nextX, y: nextY};
  }
  return count;
}

function getStartingPipes(maze, startingPoint) {
  const pipes = []
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      const pipe = maze[startingPoint.x + x][startingPoint.y + y];
      const pipeDirections = PIPE_MAP[pipe];

      if (!pipeDirections) continue;
      if (startingPoint.x === startingPoint.x + x + pipeDirections.exitA.x &&
        startingPoint.y === startingPoint.y + y + pipeDirections.exitA.y ||
        startingPoint.x === startingPoint.x + x + pipeDirections.exitB.x &&
        startingPoint.y === startingPoint.y + y + pipeDirections.exitB.y
      ) {
        pipes.push({x: startingPoint.x + x, y: startingPoint.y + y})
      }
    }
  }
  console.log(pipes)
  return {
    pipeA: pipes[0],
    pipeB: pipes[1]
  }
}

function getStartingPoint(maze) {
  for (let x = 0; x < MAX_X; x++) {
    for (let y = 0; y < MAX_Y; y++) {
      if (maze[x][y] === 'S') return {x, y};
    }
  }

  return {x: -1, y: -1};
}

function checkPointInPolygon(inPoint, maze) {
	const numOfVertices = maze.length;

	const x = inPoint.x
	const y = inPoint.y
	let inside = false
	let p1 = maze[0]
  for (let i = 1; i < maze.length; i++) {
    let p2 = maze[i];
    if (y > Math.min(p1.y, p2.y)) {
      if (y <= Math.max(p1.y, p2.y)) {
        if (x <= Math.max(p1.x, p2.x)) {
          const xIntersection = (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
          if (p1.x === p2.x || x >= xIntersection) {
            inside = !inside;
          }
        }
      }
    }
    p1 = p2;
  }
  return inside
}
