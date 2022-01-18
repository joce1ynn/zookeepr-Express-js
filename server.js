const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

//请求前端资源
// parse incoming string or array data
//app.use() The functions are referred to as middleware.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// express.static() provide a file path to the public folder
// instruct the server to make these files static resources.
// all of our front-end code can now be accessed without having a specific server endpoint created for it!
app.use(express.static('public'));

// Use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

// GET 路由很容易测试，因为我们可以简单地进入浏览器并在搜索栏中输入 URL
// 对于 POST 请求，最常见的客户端方法是编写一个前端应用程序，该应用程序发出fetch()请求以将数据发送到服务器。
// 但是我们还没有前端，仅仅为了测试而构建一个似乎是在浪费时间。
// 我们可以使用一个名为 Insomnia 的应用程序来测试我们的 API
