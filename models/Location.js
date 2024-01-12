// -----------------------------------------------------
// Dependencies and connection
// -----------------------------------------------------
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const locationSchema = new Schema({
  // geonameid: { type: Number },
  city: { type: String, required: true },
  country: { type: String, required: true },
  // urban_area: { type: Boolean, required: true },
  // population: { type: Number },
  // coordinates: { type: String },
  desktop_img: { type: String },
  mobile_img: { type: String },
  // status: { type: String, required: true },
  // date: { type: String },
  // creator: { type: String, required: true },
});

const Location = model("Location", locationSchema);

// -----------------------------------------------------
// Export Model
// -----------------------------------------------------
module.exports = Location;
