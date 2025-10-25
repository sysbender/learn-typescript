const sum = (a, b) => {
  return a + b;
};
const subtract = (a, b) => {
  return a - b;
};

const sumAsync = (a, b) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(a + b), 100);
  });
};

const subtractAsync = (a, b) => {
  return new Promise((resolve) => {
    setTimeout(resolve(a - b), 100);
  });
};

module.exports = { sum, subtract, sumAsync, subtractAsync };
