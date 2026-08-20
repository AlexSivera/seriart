/* Dev-only static file server for local preview. Not shipped to production —
   deploy the plain HTML/CSS/JS/assets folder to Hostinger (or any static host)
   instead. Usage: node tools/dev-server.js [port] */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const port = Number(process.argv[2] || process.env.PORT || 8765);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon"
};

http.createServer(function (req, res) {
  let reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (reqPath.endsWith("/")) reqPath += "index.html";
  let filePath = path.normalize(path.join(root, reqPath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, function (err, data) {
    if (err) {
      fs.readFile(path.join(root, "404.html"), function (err2, data404) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(err2 ? "Not found: " + reqPath : data404);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, function () {
  console.log("Seriart dev server running at http://localhost:" + port);
});
