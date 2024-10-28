type User = { name: string; age: number };

const userMap = new Map<number, User>();

userMap.set(1, { name: "John", age: 31 });
userMap.set(2, { name: "Jane", age: 21 });
  
//@ts-expect-error
userMap.set("3", { name: "anna", age: 18 });

// @ts-expect-error
userMap.set(4, "123");
