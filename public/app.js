const baseUrl = "https://api.teleport.org/api/";
const citySearchString = "cities/?search=";
let searchByNameUrl = `${baseUrl}${citySearchString}`;
let $searchResultsDiv = $(".search-results-div");

function makeUrl() {
  let searchString = document.querySelector("#search-field").value;
  return searchByNameUrl + searchString + "&limit=5";
}

async function fetchCitySearchResults() {
  $searchResultsDiv.empty();
  let url = makeUrl();
  const response = await fetch(url);
  const responseJson = await response.json();
  const citiesFoundArray = await responseJson._embedded["city:search-results"];
  // console.log(searchResults);
  for (i = 0; i < citiesFoundArray.length; i++) {
    let cityUrl = citiesFoundArray[i]._links["city:item"].href;

    foundCityObject = await getCityDetails(cityUrl);
    // console.dir(await foundCityObject);
    await renderSearchResults(foundCityObject);
  }
}

async function getCityDetails(cityUrl) {
  const response = await fetch(cityUrl);
  const cityData = await response.json();

  let foundCityObject = {
    geonameid: cityData.geoname_id,
    city: cityData.name,
    country: cityData._links["city:country"].name,
    urban_area: "",
    urban_area_url_exists: false,
    population: cityData.population,
    coordinates: {
      latitude: cityData.location.latlon.latitude,
      longitude: cityData.location.latlon.longitude,
    },
    photo_url: "/placeholder-background.png",
    desktop_img: "/placeholder-background.png",
    mobile_img: "/placeholder-background.png",
    status: "",
    date: "",
    notes: "",
  };

  if (cityData._links["city:urban_area"] == undefined) {
    foundCityObject.urban_area_url_exists = false;
  } else if (cityData._links["city:urban_area"].name.includes(cityData.name)) {
    foundCityObject.urban_area = cityData._links["city:urban_area"].href;
    foundCityObject.urban_area_url_exists = true;
    cityPhotos = await getCityPhotos(foundCityObject.urban_area);
    foundCityObject.desktop_img = await cityPhotos.desktop_img;
    foundCityObject.mobile_img = await cityPhotos.mobile_img;
  }
  // console.dir(`after if/urban ${await foundCityObject}`);
  return foundCityObject;
}

async function getCityPhotos(urban_area) {
  const response = await fetch(`${urban_area}images/`);
  const cityImages = await response.json();
  cityPhotos = {
    mobile_img: cityImages.photos[0].image.mobile,
    desktop_img: cityImages.photos[0].image.web,
  };
  // console.dir(`after photos ${cityPhotos}`);
  return cityPhotos;
}

async function renderSearchResults(foundCityObject) {
  // console.log(`renderSearchResults console ${foundCityObject}`);
  $searchResultsDiv.append(`
                          <div class="search-result-item" id="${foundCityObject.geonameid}-1">
                            <div class="city-photo">
                              <img src="${foundCityObject.mobile_img}" />
                            </div>
                            <div class="city-action-container">
                              <form action="/index" method="post" class="search-overlay-form">
                                <div class="action-block">
                                  <div class="city-name-container">
                                    <div class="city-full-name">${foundCityObject.city}, ${foundCityObject.country}</div>
                                  </div>
                                  <div class="location-stats">
                                    <table class="location-stats-table">
                                      <tr>
                                        <td>Population</td>
                                        <td>${foundCityObject.population.toLocaleString()}</td>
                                      </tr>
                                      <tr>
                                        <td>Status</td>
                                        <td>
                                          <select name="status">
                                            <option value="Visited">Visited</option>
                                            <option value="Going">Going</option>
                                            <option value="Want to go">Want to go</option>
                                          </select>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="2"><input type="date" name="date" value="${foundCityObject.date}" /></td>
                                      </tr>
                                    </table>
                                    <input type="text" class="hidden-form" name="geonameid" value="${foundCityObject.geonameid}" id="form-geonameid" />
                                    <input type="text" class="hidden-form" name="city" value="${foundCityObject.city}" id="form-city" />
                                    <input type="text" class="hidden-form" name="country" value="${foundCityObject.country}" id="form-country" />
                                    <input type="text" class="hidden-form" name="urban_area" value="${foundCityObject.urban_area}" id="form-urban_area" />
                                    <input type="text" class="hidden-form" name="population" value="${foundCityObject.population}" id="form-population" />
                                    <input type="text" class="hidden-form" name="latitude" value="${foundCityObject.coordinates.latitude}" id="form-latitude" />
                                    <input type="text" class="hidden-form" name="longitude" value="${foundCityObject.coordinates.longitude}" id="form-longitude" />
                                    <input type="text" class="hidden-form" name="photo_url" value="" id="form-photo_url" />
                                    <input type="text" class="hidden-form" name="desktop_img" value="${foundCityObject.desktop_img}" />
                                    <input type="text" class="hidden-form" name="mobile_img" value="${foundCityObject.mobile_img}" />
                                    <input type="text" class="hidden-form" name="notes" value="${foundCityObject.notes}" id="form-notes" />
                                    <input type="text" class="hidden-form" name="creator" value="${foundCityObject.creator}" />
            
                                  </div>
                                  <div class="buttons-container">
                                    <button class="add-city-button">Add to Collection</button>
                                  </div>
                                  </div>
                                </form>
                            </div>
                          </div>
                          `);
}

function sendCityToCollection(foundCityObject) {
  console.log(foundCityObject.city);
}

let searchField = document.getElementById("search-field");
searchField.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    fetchCitySearchResults();
  }
});
