// -----------------------------------------------------
// Dependencies
// -----------------------------------------------------
const express = require("express");
const Location = require("../models/Location");
const router = express.Router();

// -----------------------------------------------------
// Middleware
// -----------------------------------------------------
router.use((req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/");
  }
});

// -----------------------------------------------------
// Routes
// -----------------------------------------------------
// Index
router.get("/", async (req, res) => {
  const creator = req.session.username;
  let allCities = await Location.find({ creator });
  res.render("index.ejs", { allCities, creator });
});

// New
router.get("/new", (req, res) => {
  const creator = req.session.username;
  res.render("new.ejs", { creator });
});

// Delete
router.delete("/:id/", async (req, res) => {
  const creator = req.session.username;
  let deletedCity = await Location.findByIdAndDelete(req.params.id);
  res.redirect("/index");
});

// Update
router.put("/:id", async (req, res) => {
  const creator = req.session.username;
  try {
    const id = req.params.id;
    let updateForm = req.body;

    let locationFormatted = {
      city: updateForm.city,
      country: updateForm.country,
      population: updateForm.population,
      coordinates: {
        latitude: updateForm.latitude,
        longitude: updateForm.longitude,
      },
      photo_url: updateForm.photo_url,
      status: updateForm.status,
      date: updateForm.date,
      notes: updateForm.notes,
    };
    let updateCity = await Location.findByIdAndUpdate(id, locationFormatted);
    res.redirect(`/index/${id}`);
  } catch (error) {
    console.log(`====== ${error} ======`);
    res.status(400).send("yo, something's not working");
  }
});

// Create
router.post("/", async (req, res) => {
  const creator = req.session.username;
  let form = req.body;
  let locationFormatted = {
    city: form.city,
    country: form.country,
    population: form.population,
    coordinates: {
      latitude: form.latitude,
      longitude: form.longitude,
    },
    photo_url: form.photo_url,
    status: form.status,
    date: form.date,
    notes: form.notes,
    creator: req.session.username,
  };
  console.dir(locationFormatted);
  let location = await Location.create(locationFormatted);
  res.redirect("/index");
});

// Edit
router.get("/:id/edit", async (req, res) => {
  const creator = req.session.username;
  let locationDetails = await Location.findById(req.params.id);
  res.render("edit.ejs", { locationDetails, creator });
});

// Show
router.get("/:id", async (req, res) => {
  const creator = req.session.username;
  let locationDetails = await Location.findById(req.params.id);
  res.render("show.ejs", { locationDetails, creator });
});

// -----------------------------------------------------
// Export Code
// -----------------------------------------------------
module.exports = router;
