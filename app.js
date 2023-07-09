const path = require("path");
const fs = require("fs");

const express = require("express");
const app = express();

const uuid = require("uuid");

// Set up the view engine for the Express application
// The first line specifies the directory where the view files are located
// The second line specifies that the application will use EJS as its view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// allows static files to be served from the defined folder
app.use(express.static("public"));

// parse incoming http request bodies
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json");

  // read the file data
  const fileData = fs.readFileSync(filePath);
  // convert data to JS object
  const storedRestaurants = JSON.parse(fileData);

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;

  const filePath = path.join(__dirname, "data", "restaurants.json");
  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-details", {  restaurant: restaurant });
    }
  }

  res.render("404");

});

app.get("/confirmation", function (req, res) {
  res.render("confirm");
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

app.post("/recommend", function (req, res) {
  // get form data
  const restaurant = req.body;
  // generate unique id and add to restaurant object
  restaurant.id = uuid.v4();
  // define location of file that's being used
  const filePath = path.join(__dirname, "data", "restaurants.json");

  // read the file data
  const fileData = fs.readFileSync(filePath);
  // convert data to JS object
  const storedRestaurants = JSON.parse(fileData);
  // add form data to the parsed data
  storedRestaurants.push(restaurant);
  // convert the newly updated data back to JSON and write to defined file
  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));

  res.redirect("/confirmation");
});

app.get("/about", function (req, res) {
  res.render("about");
});

// handle 404 errors
app.use(function(req, res) {
  res.render("404");
});

// handle 500 errors
app.use(function (err, req, res, next) {
 res.render("500");
});

app.listen(3000);
