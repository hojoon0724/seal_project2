// -----------------------------------------------------
// Dependencies
// -----------------------------------------------------
const express = require("express");
const Location = require("../models/Location");
const router = express.Router();

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
  req.body.username = req.session.username;
  let form = req.body;

  if (form.desktop_img === "" && form.mobile_img === "") {
    console.log("no photos");
    form.desktop_img = form.photo_url;
    form.mobile_img = form.photo_url;
  }

  // form.urban_area === undefined ? (form.urban_area_url_exists = false) : (form.urban_area_url_exists = true);

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
  // res.send(location);
  res.redirect("/index");
});

// Edit
router.get("/:id/edit", async (req, res) => {
  const creator = req.session.username;
  let locationDetails = await Location.findById(req.params.id);
  res.render("edit.ejs", { locationDetails, creator });
});

// Seed
// app.get("/index/seed", async (req, res) => {
//   const creator = req.session.username;
//   console.log("seeding DB");
//   await Location.deleteMany({});
//   await Location.create(req.model.seedData);
//   res.redirect("/index");
// });

// Show
router.get("/:id", async (req, res) => {
  const creator = req.session.username;
  let locationDetails = await Location.findById(req.params.id);
  console.log(locationDetails);
  res.render("show.ejs", { locationDetails, creator });
});

// -----------------------------------------------------
// Export Code
// -----------------------------------------------------
module.exports = router;
