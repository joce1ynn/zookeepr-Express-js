const express = require("express");
const { animals } = require("./data/animals.json");

// 通过 Heroku 服务的应用程序以及大多数主机必须在端口 80 上运行。如果主机使用 HTTPS，则端口将设置为 443
const PORT = process.env.PORT || 3001;
const app = express();

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];

  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
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

app.get("/api/animals", (req, res) => {
  //   res.send("Hello!");
  //   res.json(animals);
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// add the following code to the end of server.js:
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

// If you're browsing the internet, chances are you're visiting the address on one of two ports: 80 or 443.
// 80 is typically used for sites that begin with http://, and 443 is used for sites that begin with https://

// ports with numbers 1024 and under are considered special by the operating system,
// and often require special permissions
// To avoid these permission restrictions, we chose to run on a port that is less restricted

// port numbers can range from 1024 to 49151
