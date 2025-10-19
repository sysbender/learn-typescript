// same type

const carMakers = ["ford", "honda", "toyota"];

// map

const u = carMakers.map((s) => {
  return s.toUpperCase();
});
console.log(u);
// flexible  types

const dates: (Date | string)[] = [new Date()];
dates.push("2025-10-20");

console.log(dates);
