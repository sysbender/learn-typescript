function generateRandomNumber2(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

module.exports = generateRandomNumber;
