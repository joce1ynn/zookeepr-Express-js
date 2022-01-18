// 我们不能再使用 app，因为它是在server.js文件中定义的，在这里无法访问。
// 我们将使用Router，它允许您在任何文件中声明路由，只要您使用正确的中间件。
//instead of passing around the same app to every file
//we use another feature of Express.js called the Router.
const router = require("express").Router();

const {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal,
} = require("../../lib/animals");
const { animals } = require("../../data/animals");

// to transfer data from server to client (GET)
router.get("/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

router.get("/animals/:id", (req, res) => {
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
router.post("/animals", (req, res) => {
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

module.exports  = router;
