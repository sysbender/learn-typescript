// Define the interface first

interface Describable {
  summary(): string;
}

interface VehicleData {
  name: string;
  year: number;
  broken: boolean;
}

interface Vehicle extends VehicleData, Describable {}

// Function that prints summary
const printSummary = (item: Describable): void => {
  console.log(item.summary());
};

// Create an object that implements the Vehicle interface
const oldCivic = {
  name: "civic",
  year: 2000,
  broken: true,
  summary(): string {
    return `Vehicle: name = ${this.name}, year = ${this.year}, broken = ${this.broken}`;
  },
};

// Run the function
printSummary(oldCivic);
