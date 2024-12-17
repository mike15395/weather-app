const APIkey = "57c6231db7bd4bde9b0101357241212";
const airQuality = "yes";

async function getWeatherData(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${location}&aqi=${airQuality}
  `
  );
  return response;
}

// document.querySelector(".weather-details").style.display = "none";

let locationInput = document.getElementById("location-input");
let weatherBtn = document.getElementById("weather-button");

let locationDetails = document.getElementById("location");
let temp = document.getElementById("temprature");
let status = document.getElementById("status");
let humidity = document.getElementById("humidity-value");
let statusImage = document.getElementById("status-img");
let windSpeed = document.getElementById("wind-speed-value");
weatherBtn.addEventListener("click", displayWeatherData);
let loading = "<div>Loading...</div>";

async function displayWeatherData() {
  document.querySelector(".weather-details").innerHTML = loading;
  const response = await getWeatherData(locationInput.value);
  const weatherResult = await response.json();
  console.log(response, "response");
  console.log(weatherResult, "response-json");
  if (response.status === 200) {
    // document.querySelector(".weather-details").style.display = "block";
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
    // document.querySelector(".weather-details").style.display = "block";
    document.querySelector(
      ".weather-details"
    ).innerHTML = `<div>${weatherResult?.error?.message}</div>`;
  }
}
