import { Equal, Expect } from "@total-typescript/helpers";

type Coordinate = [lat: number, long: number, elev?: number];

type Coordinate1 = [number, number, number?];
const goToLocation = (coordinates: Coordinate) => {
  const lat = coordinates[0];
  const long = coordinates[1];
  const elev = coordinates[2];

  //
  type tests = [
    Expect<Equal<typeof lat, number>>,
    Expect<Equal<typeof long, number>>,
    Expect<Equal<typeof elev, number | undefined>>,
  ];
  goToLocation([10, 20]);

  //   goToLocation([10, "20"]);
  goToLocation([10, 20, 30]);
};
