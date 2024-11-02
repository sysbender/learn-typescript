function move(direction: "up" | "down" | "left" | "right", distance: number) {
  //
}

move("up", 10);
move("left", 5);

move(
  // @ts-expect-error)
  "up-right",
  10
);
