const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/items") {
    const filePath = path.join(__dirname, "data.json");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "application/json",
        });
        return res.end(JSON.stringify({ error: "File error" }));
      }

      try {
        const items = JSON.parse(data);

        res.writeHead(200, {
          "Content-Type": "application/json",
        });

        return res.end(JSON.stringify(items));
      } catch (e) {
        res.writeHead(500, {
          "Content-Type": "application/json",
        });

        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(port);