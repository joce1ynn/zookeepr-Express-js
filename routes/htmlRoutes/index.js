const path = require("path");
const router = require("express").Router();

// app.get() 响应一个 HTML 页面以显示在浏览器中. 请求前端资源
//request to the server's route / and it responded with the HTML
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

//just like api/animals
router.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/animals.html"));
});

router.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
});

//当客户端请求一个不存在的路由时，用*返回。路线*应始终排在最后。
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

module.exports = router;
