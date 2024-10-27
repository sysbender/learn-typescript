type Ingredient = {
  name: string;
  quantity: string;
};
type Recipe = {
  title: string;
  instructions: string;
  ingredients: Array<Ingredient>;
};

const processRecipe = (recipe: Recipe) => {};

processRecipe({
  title: "Chcolate chip cookies",
  ingredients: [
    { name: "flour", quantity: "2 cpus" },
    { name: "sugar", quantity: "1 cup" },
  ],
  instructions: "...",
});
