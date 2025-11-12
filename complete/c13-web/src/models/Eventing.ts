export type Callback = () => void;

export class Eventing {
  // TODO: typescript index signature  - define an object type with unknown property names but known value type , [key:string]  mean any key of this type
  events: { [key: string]: Callback[] } = {};

  on = (eventName: string, callback: Callback): void => {
    const handlers = this.events[eventName] || []; // if undefined, then fallback to []
    handlers.push(callback);
    this.events[eventName] = handlers;
  };

  trigger = (eventName: string): void => {
    const handlers = this.events[eventName];
    if (!handlers || handlers.length === 0) {
      return;
    }
    for (const handler of handlers) {
      handler();
    }
  };
}
