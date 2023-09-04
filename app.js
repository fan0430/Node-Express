const express = require('express');
const app = express();

// app.get('/', (request, response) => {
//     response.send(`<h1>Hello, Node</h1>`)
// })

// app.get("/page/index", (request, response) => {
//     response.send(`<h1>Hello, Node</h1>`);
// });

// app.get("/page/about", (request, response) => {
//     response.send(`<h1>About Node</h1>`);
// });

// app.use((req, res, next) => {
//     console.log("這是 middleware");
//     // notDefined(); // 執行一個沒有定義的函式
//     next(); // 一定要加這個函式才會往下處理
// });

function middleware(req, res, next) {
    console.log("這是 middleware");
    console.log("request 0=", req.params);
    const firstPathSegment = req.params[0].split("/")[0];
    if (firstPathSegment === 'page') {
        next();
    } else {
        res.status(404).send("404 Oops! 找不到網頁！");
    }

}

function middleware2(req, res, next) {
    console.log("這是 middleware2");
    next();
}

app.get("/*", middleware, middleware2, (req, res) => {
    // res.send('<h1>這是 middleware 練習</h1>');
    console.log("request 1=", req.params[0].split("/"));
    console.log("request 2=", req.query);
    // res.send('<h1>這是 middleware 練習</h1>');
    // console.log("request =", req.params);
    const params = req.params[0].split("/")[1];
    let responseText = "";

    switch (params) {
        case "fan":
            responseText = `<h1>param is ${params}</h1>`;
            break;
        case "index":
            responseText = `<h1>Hello, Node</h1>`;
            break;
        case "about":
            responseText = `<h1>About Node</h1>`;
            break;
        case "json":
            // 发送错误响应
            res.json({
                response: 1,
                error: null,
            });
            break;
        default:
            const limit = req.query.limit;
            const query = req.query.q;
            console.log("query =", limit, query);
            if (limit && query) {
                responseText = `<h1>${params} 的播放清單</h1>` +
                    `<p>關鍵字為 ${query} 的資料中找出 ${limit} 資料 </p>`;
            } else if (limit || query) {
                responseText = `<h1>Missing parameters</h1>`;
            } else {
                responseText = `<h1>param is Not Found</h1>`;
            }
    }

    if (responseText != "") res.send(responseText);
});

// 404
// app.use((req, res, next) => {
//     res.status(404).send("404 Oops! 找不到網頁！");
// });

//500
app.use((err, req, res, next) => {
    console.log("err =", err);
    console.log("err stack=", err.stack);
    console.log("err status=", err.status);
    res.status(500).send("500 程式錯誤，請聯繫 IT 人員協助！");
});

// 監聽 port

const port = process.env.port || 3000;
app.listen(port)