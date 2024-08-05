const input = process.argv[2];
const gameList = input.split('\n');

class Cube {
  constructor(color, quantity) {
    this.color = color;
    this.quantity = quantity;
  }
}

class Set {
  constructor(cubes) {
    this.cubes = cubes
  }

  getMaxQuantityPerColor() {
    return cubes.reduce((cubeQuantity, cube) => {
      if (cubeQuantity[cube.color] < cube.quantity) {
        cubeQuantity[cube.color] = cube.quantity;
      }

      return cubeQuantity;
    }, {red: 0, green: 0, blue: 0})
  }
}

class Game {
  constructor(id, sets) {
    this.id = id
    this.sets = sets
  }

  getQuantityByColor() {
    return this.sets.reduce((cubeQuantity, set) => {
      const setCubeQuantity = set.getMaxQuantityPerColor();
      cubeQuantity.red = cubeQuantity.red > setCubeQuantity.red ? cubeQuantity.red : setCubeQuantity.red
      cubeQuantity.green = cubeQuantity.green > setCubeQuantity.green ? cubeQuantity.green : setCubeQuantity.green
      cubeQuantity.blue = cubeQuantity.blue > setCubeQuantity.blue ? cubeQuantity.blue : setCubeQuantity.blue
    }, {red: 0, green: 0, blue: 0})
  }

  isPossible(cubeQuantity) {
    const selfCubeQuantity = this.getQuantityByColor()

    const isGreater = selfCubeQuantity.red > cubeQuantity.red || 
    selfCubeQuantity.green > cubeQuantity.green ||
    selfCubeQuantity.blue > cubeQuantity.blue;

    return !isGreater;
  }
}

const bagCubes = {red: 12, green: 13, blue: 14};

mapArgToGameObject(gameList).reduce((sum, game) => {
  return sum + game.isPossible(bagCubes) ? game.id : 0;
}, 0)

function mapArgToGameObject(gameStringList) {
  const gameList = gameStringList.map(gameStringToObject);
  return gameList;
}

function gameStringToObject(gameString) {
  const setString = gameString.trim().split(':')[1];
  const gameId = gameString.trim().split(':')[0].slice(5);
  const setStringList = setString.split('; ');
  const setList = setStringList.map(setStringToObject);
  return new Game(gameId, setList);
}

function setStringToObject(setString) {
  const cubeStringList = setString.trim().split(', ');
  const cubeList = cubeStringList.map(cubeStringToObject(cubeStringList));
  return new Set(cubeList);
}

function cubeStringToObject(cubeString) {
  const cubeStringList = cubeString.split(', ');

  cubeStringList.map((cubeIndex) => {
    const cubeQuantity = cubeIndex.split(', ')[0];
    const cubeColor = cubeIndex.split(', ')[1];

    return new Cube(cubeColor, cubeQuantity);
  });
  return cubeList;
}
