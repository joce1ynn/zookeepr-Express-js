const fs = require("fs");
const path = require("path");
const express = require("express");
const { animals } = require("./data/animals");

const PORT = process.env.PORT || 3001;
const app = express();

//请求前端资源
// express.static() provide a file path to the public folder
// instruct the server to make these files static resources.
// all of our front-end code can now be accessed without having a specific server endpoint created for it!
app.use(express.static("public"));
// parse incoming string or array data
//app.use() The functions are referred to as middleware.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    personalityTraitsArray.forEach((trait) => {
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);

  fs.writeFileSync(
    //在子目录中写入animals.json文件
    path.join(__dirname, "./data/animals.json"),
    //将 JavaScript数组数据保存为JSON,null意味着我们不想编辑任何现有数据
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  // return finished code to post route for response
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

// to transfer data from server to client (GET)
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

// If we make a GET request to /api/animals, then the app.get('/api/animals') callback function will execute.
// But if it's a POST request, it'll go to the one we just created
// to transfer data from client to server (POST)
app.post("/api/animals", (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted.");
  } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
  }
});

// app.get() 响应一个 HTML 页面以显示在浏览器中. 请求前端资源
//request to the server's route / and it responded with the HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//just like api/animals
app.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/animals.html"));
});

app.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

//当客户端请求一个不存在的路由时，用*返回。路线*应始终排在最后。
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

// GET 路由很容易测试，因为我们可以简单地进入浏览器并在搜索栏中输入 URL
// 对于 POST 请求，最常见的客户端方法是编写一个前端应用程序，该应用程序发出fetch()请求以将数据发送到服务器。
// 但是我们还没有前端，仅仅为了测试而构建一个似乎是在浪费时间。
// 我们可以使用一个名为 Insomnia 的应用程序来测试我们的 API
