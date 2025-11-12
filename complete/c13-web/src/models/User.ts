import { AxiosResponse } from "axios";
import { Attributes } from "./Attributes";
import { Callback, Eventing } from "./Eventing";
import { Sync } from "./Sync";
export interface UserProps {
  id?: string;
  name?: string;
  age?: number;
}
export class User {
  public events: Eventing = new Eventing();
  public sync: Sync<UserProps> = new Sync<UserProps>();
  public attributes: Attributes<UserProps>;

  constructor(attrs: UserProps) {
    this.attributes = new Attributes<UserProps>(attrs);
  }
  //use getter to pass through the call
  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }
  get get() {
    return this.attributes.get;
  }

  set(update: UserProps): void {
    this.attributes.set(update);
    this.trigger("change");
  }

  fetch = (): void => {
    const id = this.get("id");
    if (typeof id !== "string") {
      throw new Error("Cannot fetch without an id");
    }

    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data);
    });
  };

  print = (): void => {
    console.log(this.attributes);
  };

  save(): void {
    this.sync
      .save(this.attributes.getAll())
      .then((response: AxiosResponse): void => {
        this.trigger("save");
      })
      .catch(() => {
        this.trigger("error");
      });
  }
}
