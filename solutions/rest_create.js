const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/items") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const filePath = path.join(__dirname, "data.json");

      let newItem;

      try {
        newItem = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

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
          return res.end(JSON.stringify({ error: "Invalid file JSON" }));
        }

        items.push(newItem);

        fs.writeFile(filePath, JSON.stringify(items), "utf8", (writeErr) => {
          if (writeErr) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Write error" }));
          }

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newItem));
        });
      });
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(port);