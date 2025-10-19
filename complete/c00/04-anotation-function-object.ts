// annotation for parameter, could type infer for return but should use
const add = (a: number, b: number) => {
  return a + b;
};

const t = add(2, 3);
console.log(`a = ${t}`);

// anonymous function
const multiply = function (a: number, b: number): number {
  return a * b;
};

// never

const throwError = function (message: string): never {
  throw new Error(message);
};

// destructure in anontation
type Forecast = {
  date: Date;
  weather: string;
};

const logWeather = ({ date, weather }: Forecast): void => {
  console.log(` date =  ${date}  , weather = ${weather} `);
};

const todayWeather: Forecast = { date: new Date(), weather: "sunny" };

logWeather(todayWeather);
// object destrcture

const profile = {
  name: "Alex",
  age: 20,
  coords: { lat: 0, lng: 15 },
  setAge(age: number): void {
    this.age = age;
  },
};

profile.setAge(99);

const age1 = profile.age; // not destrcture
// destructure age from profile
const { age }: { age: number } = profile;

console.log(` age = ${age}`);

// destructure lat and lng

const {
  coords: { lat, lng },
}: { coords: { lat: number; lng: number } } = profile;
console.log(` coords = ${lat}, ${lng}`);
