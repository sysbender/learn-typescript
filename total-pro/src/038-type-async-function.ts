import { Equal, Expect } from "@total-typescript/helpers";

// way 1
async function fetchData(): Promise<number> {
  const response = await fetch("https://api.example.com/data");
  const data: number = await response.json(); // way 2
  return data;
}

const example = async () => {
  const data = await fetchData();
  type test = Expect<Equal<typeof data, number>>;
};
