const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === "DELETE" && req.url.startsWith("/items/")) {
    const id = Number(req.url.split("/")[2]);

    const filePath = path.join(__dirname, "data.json");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "File error" }));
      }

      let items;

      try {
        items = JSON.parse(data);
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      const index = items.findIndex((item) => item.id === id);

      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Not found" }));
      }

      items.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(items), "utf8", (writeErr) => {
        if (writeErr) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Write error" }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      });
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(port);