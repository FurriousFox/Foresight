const http = require('http');

const server = http.createServer((req, res) => {
    res.end("test");
});

server.listen(42248 /* HABIT on a T9 keypad */, () => {
    console.log('Server is running on port 42248');
});