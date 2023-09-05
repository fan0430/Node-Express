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

const port = process.env.port || 3000;
app.listen(port);

// 引入 controller
const todoController = require('./controllers/todo')

app.set('view engine', 'ejs')

const todos = [
  'first todo', 'second todo', 'third todo'
]

// 可直接使用 controller 的方法拿取資料和進行 render
app.get('/todos', todoController.getAll)

app.get('/todos/:id',todoController.get)
