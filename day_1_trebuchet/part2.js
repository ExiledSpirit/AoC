const documento = process.argv[2];
const documentoLista = documento.split('\n');

const spelledNumberList = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]

const spelledNumberCollection = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
}

console.log('thr can complete ' + canCompleteIntoSpelledNumber('thr'))

console.log(calculateDocumentCalibration(documentoLista));

function calculateDocumentCalibration(documentList) {
  const calibration = documentList.reduce((calibration, line) => {
    console.log(line + ' ' + calculateLineCalibration(line))
    return calibration + calculateLineCalibration(line);
  }, 0);

  return calibration;
}

function calculateLineCalibration(line) {
  let firstNumber = null;
  let lastNumber = null;
  let spelledNumber = '';

  for (const char of line) {
    const numberChar = parseInt(char);
    if (isNaN(numberChar)) {
      spelledNumber += char;
      
      const spelledValue = spelledNumberCollection[spelledNumber]

      if (!isNaN(spelledValue)) {
        firstNumber = firstNumber === null ? spelledValue : firstNumber;
        lastNumber = spelledValue;
      }

      if (!canCompleteIntoSpelledNumber(spelledNumber)) {
        spelledNumber = getSatisfyingSubstring(spelledNumber);
      }
    } else {
      firstNumber = firstNumber === null ? numberChar : firstNumber;
      lastNumber = numberChar;
    }
  }

  return parseInt(`${firstNumber}${lastNumber}`);
}

function canCompleteIntoSpelledNumber(incompleteSpelledNumber) {
  return spelledNumberList.some((item) => {
    return item.startsWith(incompleteSpelledNumber, 0);
  })
}

function getSatisfyingSubstring(spelledNumber) {
  if (spelledNumber.length === 1) return spelledNumber;
  const substring = spelledNumber.substring(1)
  if (canCompleteIntoSpelledNumber(substring)) return substring;
  return getSatisfyingSubstring(substring);
}
