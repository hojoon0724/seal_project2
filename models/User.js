// -----------------------------------------------------
// Dependencies
// -----------------------------------------------------

const mongoose = require("./connection");
const bcrypt = require("bcryptjs");

// -----------------------------------------------------
// Define model
// -----------------------------------------------------
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model("User", userSchema);

// -----------------------------------------------------
// Export Code
// -----------------------------------------------------
module.exports = User;
