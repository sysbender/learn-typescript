// type declaration file can be found in   definitely typed naming scheme          @types/faker

import { faker } from "@faker-js/faker"; //Cannot find module 'faker' or its corresponding type declarations.
import { Mappable } from "./Map";
export class User implements Mappable {
  name: string;
  location: {
    lat: number;
    lng: number;
  };

  constructor() {
    this.name = faker.person.firstName();
    this.location = {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    };
  }
  print(): void {
    console.log("user = ", JSON.stringify(this));
  }
  markerContent(): string {
    return `user = ${this.name}`;
  }
}

// let u = new User();

// u.print();
