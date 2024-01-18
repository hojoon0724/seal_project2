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
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
  await User.create(req.body);
  res.redirect("/user/login");
});

router.get("/login", (req, res) => {
  const creator = req.session.username;
  res.render("user/login.ejs", { creator });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new Error("Wrong");
    } else {
      if (!result) {
        throw new Error("Wrong");
      }
    }
    req.session.username = username;
    req.session.loggedIn = true;
    res.redirect("/index");
  } catch (error) {
    res.status(400).send("Error yo. Check the logs");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/user/login");
  });
});

// -----------------------------------------------------
// Export code
// -----------------------------------------------------
module.exports = router;
