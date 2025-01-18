const APIkey = "57c6231db7bd4bde9b0101357241212";
const geoAPIkey = "ed42ebc293d2455ab670d9cfe57b61f1";
const googleMapsApiKey = "AIzaSyAX5DYzrgh7IjqvqRx13JOtklgsA9X0jWA";
const airQuality = "yes";

async function getWeatherData(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${location}&aqi=${airQuality}
  `
  );
  return response;
}

let locationInput = document.getElementById("location-input");
let weatherBtn = document.getElementById("weather-button");

weatherBtn.addEventListener("click", displayWeatherData);
let loading = "<div>Loading...</div>";

//get current position of user
const successCallback = async (position) => {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  initMap(position.coords.latitude, position.coords.longitude);
  const response = await fetchCityFromCoordinates(
    position.coords.latitude,
    position.coords.longitude
  );
  const data = await response.json();
  console.log(data?.features[0]?.properties?.city, "response");
  displayWeatherData(data?.features[0]?.properties?.city);
};

const errorCallback = (error) => {
  console.log(error);
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

async function fetchCityFromCoordinates(lat, long) {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${geoAPIkey}`;
  const response = await fetch(url);
  return response;
}

async function displayWeatherData(geoLocationInput) {
  document.querySelector(".weather-details").innerHTML = loading;
  console.time("fetching api data");
  const response = await getWeatherData(
    locationInput.value ? locationInput.value : geoLocationInput
  );
  const weatherResult = await response.json();
  console.timeEnd("fetching api data");
  console.log(response, "response");
  console.log(weatherResult, "response-json");
  initMap(weatherResult?.location?.lat, weatherResult?.location?.lon);
  if (response.status === 200) {
    const weatherResultData = weatherResult?.current;
    document.querySelector(
      ".weather-details"
    ).innerHTML = `<div id="location">${weatherResult?.location?.name},${
      weatherResult?.location?.region
    },${weatherResult?.location?.country}</div>

                <div class="sub-container-1">
                    <img  alt="status" id="status-img" src=${
                      "https://" + weatherResultData?.condition?.icon
                    }>
                    <div id="temprature">${
                      weatherResultData?.temp_c
                    }<sup>o</sup>C</div>
                    <div id="status">${weatherResultData?.condition?.text}</div>
                </div>

                <div class="sub-container-2">
                    <div id="wind-speed">Wind Speed:${
                      weatherResultData?.wind_kph
                    } <span id="wind-speed-value"></span>kph</div>
                    <div id="humidity">Humidity: <span id="humidity-value">${
                      weatherResultData?.humidity
                    }</span>%</div>
                </div>`;
  } else {
    document.querySelector(
      ".weather-details"
    ).innerHTML = `<div>${weatherResult?.error?.message}</div>`;
  }
}

// Initialize and add the map
let map;

async function initMap(latitude, longitude) {
  // The location of Uluru
  const position = { lat: latitude, lng: longitude };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });
}
