const documento = process.argv[2];
console.log(documento);
console.log(documento.length);

const documentoLista = documento.split('\n');
console.log(documentoLista);
console.log(documentoLista.length);

console.log(calculateDocumentCalibration(documentoLista));

function calculateDocumentCalibration(documentList) {
  const calibration = documentList.reduce((calibration, line) => {
    return calibration + calculateLineCalibration(line);
  }, 0);

  return calibration;
}

function calculateLineCalibration(line) {
  let firstNumber = null;
  let lastNumber = null;

  for (const char of line) {
    const numberChar = parseInt(char);
    if (!isNaN(numberChar)) {
      console.log('number ' + numberChar);
      firstNumber = firstNumber === null ? numberChar : firstNumber;
      lastNumber = numberChar;
    }
  }
  console.log(`first ${firstNumber} last ${lastNumber}`)
  console.log(parseInt(`${firstNumber}${lastNumber}`));
  return parseInt(`${firstNumber}${lastNumber}`);
}
