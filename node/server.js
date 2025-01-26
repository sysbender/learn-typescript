import http from "http";
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });

  res.write("<h1>welcome</h1>");
  res.end("Hello World!!!!!\n");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:` + PORT);
});
