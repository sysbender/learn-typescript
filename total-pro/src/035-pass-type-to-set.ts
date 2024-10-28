const userIds = new Set<number>();

//const userIds : Set<number> = new Set();
userIds.add(1);
userIds.add(2);

// @ts-expect-error
userIds.add("123");

// @ts-expect-error
userIds.add({ name: "Max" });
