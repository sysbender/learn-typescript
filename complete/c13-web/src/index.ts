import { type UserProps, User } from "./models/User";

import Axios from "axios";

const user = new User({ id: "ab5e", name: "userab5e", age: 99 });

user.on("change", () => {
  console.log("user was fetched!");
  user.print();
});

user.on("save", () => {
  console.log(" user saved", user);
});
// user.fetch();
user.save();

/*
user.set({ name: "John Doe" });

user.on("change", (): void => {
  console.log(" callback triggered for event = change ");
});

user.trigger("change");
console.log(user);

// - create user
const serverRoot = "http://localhost:3000/users";
async function saveUser(user: UserProps): Promise<UserProps | null> {
  try {
    const response = await Axios.post<UserProps>(serverRoot, user);
    console.log("user created", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Failed to save user :", error.message || error);
    return null;
  }
}

// Axios.post("http://localhost:3000/users", { name: "hello", age: "1234" });

(async () => {
  const saved = await saveUser({ name: "hello", age: 1234 });
  if (saved) {
    console.log("saved = ", saved);
  } else {
    console.log("failed to save user!");
  }
})();
*/
// Axios.get("http://localhost:3000/users/37fd");

// const user1 = new User({ id: "06d3" });

// user1.set({ name: "old name", age: 4567 });
// console.log(" ------------------------save user =06d3 ");
// user1.save();
// user1.fetch();

// const user2 = new User({ name: "new user", age: 100 });
// console.log("------------------save new user");
// user2.save();

// user2.events.on("change", () => {
//   console.log("trigger change ...");
// });
// user2.events.trigger("change");

// // wait for save is finished
// setTimeout(() => {
//   user2.fetch();
// }, 4000);

// const colors = {
//   color: "red",
//   printColor: () => {
//     console.log(colors.color);
//   },
// };

// colors.printColor();
// const printColor = colors.printColor;
// printColor;
