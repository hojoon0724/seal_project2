// -----------------------------------------------------
// Dependencies
// -----------------------------------------------------
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const seedData = require("./models/seed");

// -----------------------------------------------------
// Connection
// -----------------------------------------------------
const { PORT, DATABASE_URL, SECRET } = process.env;
mongoose.connect(DATABASE_URL);
mongoose.connection.on("open", () => console.log("Connected to mongoose"));
mongoose.connection.on("close", () => console.log("Disconnected to mongoose"));
mongoose.connection.on("error", (error) => console.log("Error" + error));

// -----------------------------------------------------
// Application Object
// -----------------------------------------------------
const app = express();
const Location = require("./models/Location");

// -----------------------------------------------------
// Middleware
// -----------------------------------------------------
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  req.model = {
    Location,
    seedData,
  };
  next();
});

// -----------------------------------------------------
// Routes INDUCESS
// -----------------------------------------------------
// Index
app.get("/index", async (req, res) => {
  let allCities = await Location.find({});
  console.log(allCities);
  res.render("index.ejs", { allCities });
});

// New
app.get("/index/new", (req, res) => {
  res.render("new.ejs");
});

// Delete
app.delete("/index/:id/", async (req, res) => {
  let deletedCity = await Location.findByIdAndDelete(req.params.id);
  res.redirect("/index");
});

// Update

// Create
app.post("/index", async (req, res) => {
  console.log(req.body);
  let location = await Location.create(req.body);
});

// Edit

// Seed
app.get("/index/seed", async (req, res) => {
  console.log("seeding DB");
  await Location.deleteMany({});
  await Location.create(req.model.seedData);
  res.redirect("/index");
});

// Show
app.get("/index/:id", async (req, res) => {
  let locationDetails = await Location.findById(req.params.id);
  res.render("show.ejs", { locationDetails });
});

// -----------------------------------------------------
// GET requests
// -----------------------------------------------------
app.get("/", (req, res) => {
  res.send(`root response`);
});

// -----------------------------------------------------
// Listener
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`listening in port ${PORT}`);
});
