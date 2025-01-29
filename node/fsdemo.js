import fs from "fs/promises";

const readFileWait = async () => {
  try {
    const data = await fs.readFile("test.txt", "utf-8");
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

readFileWait();

fs.readFile("test.txt", "utf-8")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
