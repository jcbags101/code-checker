function diffChecker(firstDOM, secondDOM) {
  var codeCleaner = function (codeToClear) {
    var cleanCode = [];
    for (var i = 0; i < codeToClear.length; i++) {
      if (/\S/.test(codeToClear[i])) {
        cleanCode.push(codeToClear[i].replace(/\s\s+/g, " ").trim());
      }
    }
    return cleanCode;
  };

  var firstDOMcode = codeCleaner(firstDOM.split("\n")) || [],
    secondDOMcode = codeCleaner(secondDOM.split("\n")),
    codeLineDifference = [];

  for (var i = 0; i < secondDOMcode.length; i++) {
    if (secondDOMcode[i] !== firstDOMcode[i]) {
      codeLineDifference.push(i);
    }
  }
  return { codeLineDifference, secondDOM };
}

module.exports = diffChecker;
