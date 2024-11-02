type MyObj = {
  foo: string;
  bar: number;
  baz: boolean;
};

const acceptsObj = (obj: MyObj) => {};

//ctrl + space
acceptsObj({ foo: "", bar: 123, baz: true });

document.addEventListener("DOMContentLoaded", (event) => {
  console.log(event);
});
