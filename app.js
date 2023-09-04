const express = require('express');
const app = express();

app.get('/', (request, response) => {
    response.send(`<h1>Hello, Node</h1>`)
})

// 監聽 port

const port = process.env.port || 3000;
app.listen(port)