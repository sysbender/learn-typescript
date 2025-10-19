class Vehicle {
  //field
  public color: string;
  constructor(
    color: string,
    /*public field  shortcut */ public weight: number,
    protected speed: number
  ) {
    this.color = color;
  }

  // public field short cut

  drive(): void {
    console.log("driving ...");
  }

  summary(): string {
    return ` color = ${this.color} , weight=${this.weight}`;
  }
}

const v = new Vehicle("red", 1234, 12);
v.drive();

// extend
class Car extends Vehicle {
  public wheels: number;
  constructor(color: string, weight: number, speed: number, wheels: number) {
    super(color, weight, speed);
    this.wheels = wheels;
  }
  drive(): void {
    super.drive();
    console.log(
      `-- in a car has wheels = ${this.wheels} , at speed ${this.speed}`
    );
  }
}

const car = new Car("yellow", 2345, 23, 4);
car.drive();
console.log(car.summary());

// modifier - public - default , private, protected

// constructor - called when create new object
