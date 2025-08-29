const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Docker Node.js service is running!");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running at http://localhost:3000/");
});
