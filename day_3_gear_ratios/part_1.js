const input = process.argv[2];
const lineList = input.split('\n');

const MAX_I = lineList.length;
const MAX_J = lineList[0].length;

console.log(MAX_I)
console.log(MAX_J)

let list = mapToNumberSymbolList(lineList);

let sum = 0;
const usedIds = [];

for (let i = 0; i < MAX_I; i++) {
    for (let j = 0; j < MAX_J; j++) {
        if (list[i][j] !== null && list[i][j].type === 'symbol') {
            // Horizontal Vertical
            if (list[i][j + 1] !== null && list[i][j + 1] !== undefined)
                list[i][j + 1].adjacent = true
            if (j != 0 && list[i][j - 1] !== null && list[i][j - 1] !== undefined)
                list[i][j - 1].adjacent = true
            if (list[i + 1][j] !== null && list[i + 1][j] !== undefined)
                list[i + 1][j].adjacent = true
            if (i != 0 && list[i - 1][j] !== null && list[i - 1][j + 1] !== undefined)
                list[i - 1][j].adjacent = true
        
            // Diagonal
            if (list[i + 1][j + 1] !== null && list[i - 1][j + 1] !== undefined)
                list[i + 1][j + 1].adjacent = true
            if (i != 0 && list[i - 1][j + 1] !== null && list[i - 1][j + 1] !== undefined)
                list[i - 1][j + 1].adjacent = true
            if (j != 0 && list[i + 1][j - 1] !== null && list[i + 1][j - 1] !== undefined)
                list[i + 1][j - 1].adjacent = true
            if (j != 0 && i != 0 && list[i - 1][j - 1] !== null && list[i - 1][j - 1] !== undefined)
                list[i - 1][j - 1].adjacent = true
        }
    }
}

for (let i = 0; i < MAX_I; i++) {
    for (let j = 0; j < MAX_J; j++) {
        if (list[i][j] !== null) {
            console.log(list[i][j]);
        }
        if (list[i][j] !== null && list[i][j].adjacent === true && list[i][j].type === 'number' && !(usedIds.includes(`${i}${j}`))) {
            sum += list[i][j].value;
            usedIds.push(`${i}${j}`);
        }
    }
}



console.log(sum);

function mapToNumberSymbolList(lineList) {
    let itemsList = new Array(MAX_I).fill(null).map(() => new Array(MAX_J).fill(null));

    for (let i = 0; i < MAX_I; i++) {
        let stringNumber = '';

        for (let j = 0; j < MAX_J; j++) {
            const char = lineList[i].charAt(j);
            if (char !== '.') {
                if (isNaN(char)) {
                    if (stringNumber !== '') {
                        for (let k = 0; k < stringNumber.length; k++) {
                            itemsList[i][j-(k+1)] = { id: `${i}${j-1}`, type: 'number', value: parseInt(stringNumber), adjacent: false};
                        }
                        stringNumber = '';
                    }
                    itemsList[i][j] = { id: `${i}${j}`, type: 'symbol', value: char, adjacent: false};
                } else {
                    stringNumber += char;
                }
            } else {
                if (stringNumber !== '') {
                    for (let k = 0; k < stringNumber.length; k++) {
                        itemsList[i][j-(k + 1)] = { id: `${i}${j-1}`, type: 'number', value: parseInt(stringNumber), adjacent: false};
                    }
                    stringNumber = '';
                }
            }
        }
    }

    return itemsList;
}

function setAdjacent(list, i, j) {
    // Horizontal Vertical
    if (list[i][j + 1] !== null)
    list[i][j + 1].adjacent = true
    if (list[i][j - 1] !== null)
    list[i][j - 1].adjacent = true
    if (list[i + 1][j] !== null)
    list[i + 1][j].adjacent = true
    if (list[i - 1][j] !== null)
    list[i - 1][j].adjacent = true

    // Diagonal
    if (list[i + 1][j + 1] !== null)
    list[i + 1][j + 1].adjacent = true
    if (list[i - 1][j + 1] !== null)
    list[i - 1][j + 1].adjacent = true
    if (list[i + 1][j - 1] !== null)
    list[i + 1][j - 1].adjacent = true
    if (list[i - 1][j - 1] !== null)
    list[i - 1][j - 1].adjacent = true

    return list;
}
