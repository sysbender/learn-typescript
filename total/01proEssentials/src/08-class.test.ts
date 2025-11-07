import { test, it, expect } from "vitest";

// ===== class property and constructor
namespace V176 {
  class CanvasNode {
    readonly x: number = 0;
    readonly y: number = 0;

    // TODO: constructor receiving optional arguments
    constructor(position?: { x: number; y: number }) {
      this.x = position?.x ?? 0;
      this.y = position?.y ?? 0;
    }
    get position() {
      return { x: this.x, y: this.y };
    }
  }

  it("", () => {
    const canvasNode = new CanvasNode();
    expect(canvasNode.x).toEqual(0);
    expect(canvasNode.y).toEqual(0);

    // @ts-expect-error Property is readonly
    canvasNode.x = 1;

    // @ts-expect-error Property is readonly
    canvasNode.y = 1;
  });

  it("constructor receive arguments", () => {
    const canvasNode = new CanvasNode({ x: 10, y: 20 });
    expect(canvasNode.x).toEqual(10);
    expect(canvasNode.y).toEqual(20);
  });
}

// ===== class method
namespace V178 {
  class CanvasNode {
    #x: number = 0; // TODO:  javascript private identifier , recommended over private
    #y: number = 0;

    get x() {
      return this.#x;
    }

    get y() {
      return this.#y;
    }

    constructor(position?: { x: number; y: number }) {
      this.#x = position?.x ?? 0;
      this.#y = position?.y ?? 0;
    }
    get position() {
      return { x: this.#x, y: this.y };
    }

    set position(pos) {
      // TODO: setter only access one parameter, no need type, same type as getter , available for object
      this.#x = pos.x;
      this.#y = pos.y;
    }
    move(x: number, y: number) {
      this.#x = x;
      this.#y = y;
    }

    print() {
      console.log(` printing instance of NodeCavas`);
    }
  }

  it("hsould be able to move", () => {
    const canvasNode = new CanvasNode();
    expect(canvasNode.x).toEqual(0);
    expect(canvasNode.y).toEqual(0);

    canvasNode.move(10, 20);
    expect(canvasNode.x).toEqual(10);
    expect(canvasNode.y).toEqual(20);

    expect(canvasNode.position).toEqual({ x: 10, y: 20 });

    canvasNode.position = { x: 2, y: 3 };
    expect(canvasNode.position).toEqual({ x: 2, y: 3 });
    canvasNode.print();
  });

  // extends

  type ViewMode = "hidden" | "visible" | "selected";
  class ViewNode extends CanvasNode {
    #viewMode: ViewMode;

    // constructor(options?: { x: number; y: number; viewMode?: ViewMode }) {
    //   super(options ? { x: options.x, y: options.y } : { x: 0, y: 0 }); //ternary operator
    //   this.#viewMode = options?.viewMode ?? "visible";
    // }

    constructor({
      // TODO: Destructuring with defaults
      x = 0,
      y = 0,
      viewMode = "visible",
    }: { x?: number; y?: number; viewMode?: ViewMode } = {}) {
      super({ x, y });
      this.#viewMode = viewMode;
    }
    hide() {
      this.#viewMode = "hidden";
    }

    get isHidden() {
      return this.#viewMode === "hidden";
    }
    get isSelected() {
      return this.#viewMode === "selected";
    }

    get isVisible() {
      return this.#viewMode === "visible";
    }

    override print() {
      console.log(` printing instance of ViewNode`);
    }
  }

  it(" viewnode", () => {
    const viewNode = new ViewNode();
    expect(viewNode.x).toEqual(0);
    expect(viewNode.y).toEqual(0);

    viewNode.move(10, 20);
    expect(viewNode.x).toEqual(10);
    expect(viewNode.y).toEqual(20);

    expect(viewNode.position).toEqual({ x: 10, y: 20 });

    viewNode.position = { x: 2, y: 3 };
    expect(viewNode.position).toEqual({ x: 2, y: 3 });

    viewNode.print();
  });
}

// ===== TODO: this in functions and objects
namespace V193 {
  function add(this: { x: number; y: number }) {
    return this.x + this.y;
  }
  // can not use arrow function as method to object
  function setValues(this: { x: number; y: number }, x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  it("should add numbers", () => {
    const calculator = {
      x: 0,
      y: 0,
      add,
      setValues,
    };

    calculator.setValues(1, 2);

    expect(calculator.add()).toEqual(3);
  });
}
