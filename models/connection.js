// -----------------------------------------------------
// Dependencies
// -----------------------------------------------------
require("dotenv").config();
const mongoose = require("mongoose");

// -----------------------------------------------------
// Connection
// -----------------------------------------------------
const { PORT, DATABASE_URL, SECRET } = process.env;
mongoose.connect(DATABASE_URL);
mongoose.connection.on("open", () => console.log("Connected to mongoose"));
mongoose.connection.on("close", () => console.log("Disconnected to mongoose"));
mongoose.connection.on("error", (error) => console.log("Error" + error));

// -----------------------------------------------------
// Export Code
// -----------------------------------------------------
module.exports = mongoose;
