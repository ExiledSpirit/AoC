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

const startingPoint = getStartingPoint(pipeMazeArray);
const { pipeA, pipeB } = getStartingPipes(pipeMazeArray, startingPoint)

let currentPipe = {x: pipeA.x, y: pipeA.y};
let previousPipe = {x: startingPoint.x, y: startingPoint.y};

const loopLength = getLoopLength(pipeMazeArray, currentPipe, previousPipe);

console.log(Math.ceil(loopLength/2))

function getLoopLength(maze, currentPipe, previousPipe) {
  let count = 0;
  while (pipeMazeArray[currentPipe.x][currentPipe.y] != 'S') {
    count++;
    const currentPipeChar = pipeMazeArray[currentPipe.x][currentPipe.y]
    const previousPipeHolder = previousPipe;
    const {exitA, exitB} = PIPE_MAP[currentPipeChar]
    // console.log(currentPipeChar)
    let nextX = currentPipe.x + exitA.x;
    let nextY = currentPipe.y + exitA.y;

    if (nextX !== previousPipeHolder.x || nextY !== previousPipeHolder.y){
      previousPipe = currentPipe;
      currentPipe = {x: nextX, y: nextY}
    } else {
      nextX = currentPipe.x + exitB.x;
      nextY = currentPipe.y + exitB.y;

      previousPipe = currentPipe;
      currentPipe = {x: nextX, y: nextY};
    }
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
