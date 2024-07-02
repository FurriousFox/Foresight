const http = require('http');
const fs = require("fs");

const server = http.createServer((req, res) => {
    // res.end("test");
    console.log(req);

    if (req.url == "/" || req.url == "/index.html") {
        res.setHeader("Content-Type", "text/html");
        res.end(fs.readFileSync("index.html"));
    } else if (req.url == "/index.js") {
        res.setHeader("Content-Type", "text/javascript");
        res.end(fs.readFileSync("bindex.js"));
    } else if (req.url.split("?")[0] == "/config.html") {
        res.setHeader("Content-Type", "text/html");
        res.end(fs.readFileSync("config.html"));
    } else if (req.url == "/icon.png") {
        res.setHeader("Content-Type", "image/png");
        res.end(fs.readFileSync("icon.png"));
    } else if (req.url == "/icon512.png") {
        res.setHeader("Content-Type", "image/png");
        res.end(fs.readFileSync("icon512.png"));
    } else if (req.url == "/icon192.png") {
        res.setHeader("Content-Type", "image/png");
        res.end(fs.readFileSync("icon192.png"));
    } else if (req.url == "/manifest.json") {
        res.setHeader("Content-Type", "application/json");
        res.end(fs.readFileSync("manifest.json"));
    } else if (req.url == "/sw.js") {
        res.setHeader("Content-Type", "text/javascript");
        res.end(fs.readFileSync("sw.js"));
    } else {
        res.statusCode = 404;
        res.end("Not found");
    }
});

server.listen(42248 /* HABIT on a T9 keypad */, () => {
    console.log('Server is running on port 42248');
});