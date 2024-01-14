// -----------------------------------------------------
// Dependencies and connection
// -----------------------------------------------------
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const locationSchema = new Schema({
  geonameid: { type: Number },
  city: { type: String, required: true },
  country: { type: String, required: true },
  urban_area: { type: String },
  urban_area_url_exists: { type: Boolean },
  population: { type: Number },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  photo_url: { type: String },
  desktop_img: { type: String },
  mobile_img: { type: String },
  status: { type: String },
  date: { type: String },
  notes: { type: String },
  // creator: { type: String, required: true },
});

const Location = model("Location", locationSchema);

// -----------------------------------------------------
// Export Model
// -----------------------------------------------------
module.exports = Location;
