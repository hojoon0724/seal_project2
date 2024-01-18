// -----------------------------------------------------
// Dependencies
// -----------------------------------------------------
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// -----------------------------------------------------
// Routes
// -----------------------------------------------------
router.get("/signup", (req, res) => {
  const creator = req.session.username;
  if (req.session.loggedIn === true) {
    res.redirect("/index");
  } else {
    res.render("user/signup.ejs", { creator });
  }
});

router.post("/signup", async (req, res) => {
  const creator = req.session.username;
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
  console.log(req.body.username);
  console.log(req.body.password);
  await User.create(req.body);
  res.redirect("/user/login");
});

router.get("/login", (req, res) => {
  const creator = req.session.username;
  res.render("user/login.ejs", { creator });
});

router.post("/login", async (req, res) => {
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

router.get("/logout", async (req, res) => {
  const creator = req.session.username;
  req.session.destroy((err) => {
    res.redirect("/user/login");
  });
});

// -----------------------------------------------------
// Export code
// -----------------------------------------------------
module.exports = router;
