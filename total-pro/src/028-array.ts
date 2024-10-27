type ShoppingCart = {
  userId: string;
  items: string[]; // Array<string>
};

const processCart = (cart: ShoppingCart) => {};

processCart({
  userId: "user123",
  items: ["item1", "item2", "item3"],
});
