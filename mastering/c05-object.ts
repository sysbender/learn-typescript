const coord: { x: number; y: number } = { x: 20, y: 30 };
// type alias
type Point = { x: number; y: number };

const p1: Point = { x: 1, y: 2 };

type myNum = number;
// optional property

type Point3D = { x: number; y: number; z?: number };

const p3d1: Point3D = { x: 1, y: 2, z: 4 };

// readonly
type User = {
  readonly id: string;
  username: string;
};

const user: User = { id: "123", username: "cat" };
user.username = "dog";
