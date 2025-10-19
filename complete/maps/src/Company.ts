import { faker } from "@faker-js/faker";
import { Mappable } from "./Map";

export class Company implements Mappable {
  companyName: string;
  catchPhrase: string;
  location: { lat: number; lng: number };

  constructor() {
    this.companyName = faker.company.name();
    this.catchPhrase = faker.company.catchPhrase();
    this.location = {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    };
  }

  toString(): string {
    return JSON.stringify(this);
  }
  print(): void {
    console.log(this.toString());
  }
  markerContent(): string {
    return `company = ${this.companyName}`;
  }
}

// const c = new Company();
// c.print();
