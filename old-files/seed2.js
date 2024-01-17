/*const seed1 = require("./models/seed");

const fs = require("fs");


function restructureData() {
  for (city of seed1) {
    let cityStructure = {
      geonameid: "",
      city: city.city,
      country: city.country,
      urban_area: ""
      urban_area_url_exists: false
      population: 
      coordinates: {
        latitude:
        longitude:
      },
      photo_url:
      desktop_img:
      mobile_img:
      status:
      date:
      notes:
    };
    console.log(city);
  }
}


function exportCityNames() {
  for (city of seed1) {
    newData.push({ city: city.city });
  }
}

let newData = [];

exportCityNames();

console.log(newData);
fs.writeFile("./newDataStructureTest.js", newData);
*/

const seed1 = require("../models/seed");
const fs = require("fs");

let newData = []; // Initialize the newData array

function exportCityNames() {
  for (city of seed1) {
    let status = ["Visited", "Going", "Want to go"];
    let randomizedStatus = status[Math.floor(Math.random() * 3)];
    if (city.status === "Visited") {
      processedStatus = "Visited";
    } else {
      processedStatus = randomizedStatus;
    }
    newData.push({
      geonameid: "",
      city: city.city,
      country: city.country,
      urban_area: "",
      urban_area_url_exists: false,
      population: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
      photo_url: city.desktop_img,
      desktop_img: city.desktop_img,
      mobile_img: city.desktop_img,
      status: processedStatus,
      date: "",
      notes: "",
    });
  }
}

exportCityNames();

console.log(newData);
const newDataString = JSON.stringify(newData, null, 2);
fs.writeFile("./newDataStructureTest.js", newDataString, (err) => {
  if (err) throw err;
  console.log("Data has been written to newDataStructureTest.js");
});
