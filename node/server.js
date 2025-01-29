import http from "http";
import fs from "fs/promises";
import url from "url";
import path from "path";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(import.meta.url, __filename, __dirname);

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  console.log("Request received" + `${req.url}`);
  console.log("Request received" + `${req.method}`);

  res.write("<h1>welcome</h1>");
  res.end("Hello World!!!!!\n");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:` + PORT);
});
