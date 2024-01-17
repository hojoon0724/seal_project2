// -----------------------------------------------------
// Dependencies
// -----------------------------------------------------
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const seedData = require("./models/seed");
const bcrypt = require("bcrypt");
const session = require("express-session");

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
const User = require("./models/User");
const MongoStore = require("connect-mongo");

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
app.use(
  session({
    secret: process.env.SECRET,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    saveUninitialized: true,
    resave: false,
    // username: req.session.username,
  })
);

app.use((req, res, next) => {
  let username = req.session.username;
  if (username === undefined) {
    username = " ";
  } else {
  }
  next();
});

// -----------------------------------------------------
// Routes INDUCESS
// -----------------------------------------------------
// Index
app.get("/index", async (req, res) => {
  const creator = req.session.username;
  let allCities = await Location.find({ creator });
  res.render("index.ejs", { allCities, creator });
});

// New
app.get("/index/new", (req, res) => {
  const creator = req.session.username;
  res.render("new.ejs", { creator });
});

// Delete
app.delete("/index/:id/", async (req, res) => {
  const creator = req.session.username;
  let deletedCity = await Location.findByIdAndDelete(req.params.id);
  res.redirect("/index");
});

// Update
app.put("/index/:id", async (req, res) => {
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
app.post("/index", async (req, res) => {
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
app.get("/index/:id/edit", async (req, res) => {
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
app.get("/index/:id", async (req, res) => {
  const creator = req.session.username;
  let locationDetails = await Location.findById(req.params.id);
  console.log(locationDetails);
  res.render("show.ejs", { locationDetails, creator });
});

// -----------------------------------------------------
// User auth
// -----------------------------------------------------

app.get("/user/signup", (req, res) => {
  const creator = req.session.username;
  if (req.session.loggedIn === true) {
    res.redirect("/index");
  } else {
    res.render("user/signup.ejs", { creator });
  }
});

app.post("/user/signup", async (req, res) => {
  const creator = req.session.username;
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
  console.log(req.body.username);
  console.log(req.body.password);
  await User.create(req.body);
  res.redirect("/user/login");
});

app.get("/user/login", (req, res) => {
  const creator = req.session.username;
  res.render("user/login.ejs", { creator });
});

app.post("/user/login", async (req, res) => {
  const creator = req.session.username;
  console.log(req.body);
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log(user);
  const result = await bcrypt.compare(password, user.password);
  console.log(result);
  if (!result) {
    console.log("nop");
  }
  console.log(username, password);
  console.log(req.session);
  req.session.username = username;
  req.session.loggedIn = true;
  res.redirect("/index");

  // try {
  //   const { username, password } = req.body;
  //   const user = await User.findOne({ username });

  //   if (!user) {
  //     throw new Error("Nope. Wrong user");
  //   }

  //   const result = await bcrypt.compare(password, user.password);

  //   if (!result) {
  //     throw new Error("Nope. Wrong stuff");
  //   }

  //   req.session.username = username;
  //   req.session.loggedIn = true;
  // } catch (error) {
  //   res.status(400).send("eror yo");
  // }
});

app.get("/user/logout", async (req, res) => {
  const creator = req.session.username;
  req.session.destroy((err) => {
    res.redirect("/user/login");
  });
});

// -----------------------------------------------------
// GET requests
// -----------------------------------------------------
app.get("/", (req, res) => {
  const creator = req.session.username;
  res.send(`root response`);
});

// -----------------------------------------------------
// Listener
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`listening in port ${PORT}`);
});
