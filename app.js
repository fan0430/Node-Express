const express = require('express');
const app = express();

// 将静态文件放在名为 "resources" 的目录中
app.use(express.static('resources'));

// 用于处理HTTP POST请求中的表单数据。具体来说，它处理了以下内容
app.use(express.urlencoded({
    /*
    处理表单数据的扩展选项：在代码中，extended: false 选项告诉中间件使用Node.js内置的querystring库来解析表单数据，而不是使用更复杂的第三方库。
    这意味着解析的数据将不包含嵌套对象和数组。如果将此选项更改为true，则中间件将使用第三方库来支持更复杂的数据结构。
    */
    extended: false
}))

// EJS 核心
const engine = require("ejs-locals");
app.engine("ejs", engine);
// 讀取 EJS 檔案位置
app.set('views', './views');
// 用 EJS 引擎跑模板
app.set("view engine", "ejs");

function middleware(req, res, next) {
    console.log("這是 middleware");
    console.log("request 0=", req.params);
    const firstPathSegment = req.params[0].split("/")[0];
    if (firstPathSegment === 'page') {
        next();
    } else {
        if (firstPathSegment == "") {
            // res.send("<h1>這是 middleware 練習</h1><img src='./images/haha.png'>");
            //模板文件的文件名, 传递给视图模板的变量的对象
            res.render("index", {message:"我是傳過來的"});

        }
        else res.status(404).send("404 Oops! 找不到網頁！");
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
    let responseText = '';

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

app.post('/answer', function (req, res) {
    console.log("post =", req.body);
    console.log("post =", req.body.preferColor);
    if (req.body.preferColor == "紅色" || req.body.preferColor == "red") {
        res.send("答對了，你真暸解我")
    } else {
        res.send("對不起，不是這個答案")
    }
    // res.send("感謝送出表單")
})

// 監聽 port

const port = process.env.port || 3000;
app.listen(port)