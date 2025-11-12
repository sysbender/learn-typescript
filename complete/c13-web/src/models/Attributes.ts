// import { UserProps } from "./User";
export class Attributes<T extends object> {
  constructor(public data: T) {}

  // TODO: how to get an objet's property value when the property name is stored in a variable
  get = <K extends keyof T>(key: K): T[K] => {
    return this.data[key];
  };

  set(update: T): void {
    Object.assign(this.data, update);
  }

  getAll = (): T => {
    return this.data;
  };
}

// const attrs = new Attributes<UserProps>({ id: "5", name: "abc", age: 123 });

// const id = attrs.get("id");
