// -----------------------------------------------------
// Dependencies and connection
// -----------------------------------------------------
const mongoose = require("./connection");
const { Schema, model } = mongoose;

const locationSchema = new Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  population: { type: Number },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  photo_url: { type: String },
  status: { type: String },
  date: { type: String },
  notes: { type: String },
  creator: { type: String, required: true },
});

const Location = model("Location", locationSchema);

// -----------------------------------------------------
// Export Code
// -----------------------------------------------------
module.exports = Location;
