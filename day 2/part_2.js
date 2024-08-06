const input = process.argv[2];
const gameList = input.split('\n');

class Cube { 
    constructor(color, quantity) {
        this.color = color;
        this.quantity = quantity;
    }
}

class Conjunto {
    constructor(cubes) {
        this.cubes = cubes;
    }

    getMaxQuantityPerColor() {
        return this.cubes.reduce((cubeQuantity, cube) => {
            if (cubeQuantity[cube[0].color] < cube[0].quantity) {
                cubeQuantity[cube[0].color] = cube[0].quantity;
            }

            return cubeQuantity;
        }, {red: 0, green: 0, blue: 0});
    }
}

class Game {
    constructor(id, sets, linha) {
        this.id = id;
        this.sets = sets;
        this.linha = linha;
    }

    getQuantityByColor() {
        return this.sets.reduce((maxQuantity, set) => {
            const setQuantity = set.getMaxQuantityPerColor();
            maxQuantity.red = maxQuantity.red >= setQuantity.red ? maxQuantity.red : setQuantity.red;
            maxQuantity.green = maxQuantity.green >= setQuantity.green ? maxQuantity.green : setQuantity.green;
            maxQuantity.blue = maxQuantity.blue >= setQuantity.blue ? maxQuantity.blue : setQuantity.blue;
            return maxQuantity;
        }, {red: 0, green: 0, blue: 0})
    }

    isPossible(cubeQuantity) {
        const selfCubeQuantity = this.getQuantityByColor();

        const isGreater = selfCubeQuantity.red > cubeQuantity.red ||
        selfCubeQuantity.green > cubeQuantity.green ||
        selfCubeQuantity.blue > cubeQuantity.blue;

        return !isGreater;
    }

    calculatePower() {
        const ballSet = this.getQuantityByColor();
        return ballSet.red * ballSet.green * ballSet.blue;
    }
}

const valor = mapArgToGameObject(gameList).reduce((sum, game) => {
    return sum + game.calculatePower();
}, 0);

console.log(valor);

function mapArgToGameObject(gameStringList) {
    const gameList = gameStringList.map(gameStringToObject);
    return gameList;
}

function gameStringToObject(gameString) {
    const setString = gameString.trim().split(':')[1];
    const gameId = parseInt(gameString.trim().split(':')[0].slice(5));
    const setStringList = setString.split('; ');
    const setList = setStringList.map(setStringToObject);
    return new Game(gameId, setList, gameString);
}

function setStringToObject(setString) {
    const cubeStringList = setString.trim().split(', ');
    const cubeList = cubeStringList.map(cubeStringToObject);
    return new Conjunto(cubeList);
}

function cubeStringToObject(cubeString) {
    const cubeStringList = cubeString.split(', ');

    const cubeList = cubeStringList.map((cubeIndex) => {
        const cubeQuantity = parseInt(cubeIndex.split(' ')[0]);
        const cubeColor = cubeIndex.split(' ')[1];

        return new Cube(cubeColor, cubeQuantity);
    });

    return cubeList;
}
