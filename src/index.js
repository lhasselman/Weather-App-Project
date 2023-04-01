//global variables
let dateElement = document.querySelector("#date");
let apiKey = "97f8e93f00107773f88eafd933ce86b7";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/";
let unit = `metric`;
let cityElement = document.querySelector("#city");
let precipElement = document.querySelector("#precip");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let tempElement = document.querySelector(".temperature");
let descriptionElement = document.querySelector("#description");
let iconElement = document.querySelector("#icon");
let forecastElement = document.querySelector("#forecast");
//
function displayTime() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let now = new Date();
  let weekday = days[now.getDay()];
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let currentTime = `${weekday} ${hours}:${minutes}`;
  dateElement.innerHTML = currentTime;
}
displayTime();
//
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}
//
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-weekday">${formatForecastDay(
          forecastDay.dt
        )}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temps">
          <span class="weather-forecast-temps-max"> ${Math.round(
            forecastDay.temp.max
          )}°C </span>
          <span class="weather-forecast-temps-min"> ${Math.round(
            forecastDay.temp.min
          )}°C </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
//

//
function updatePrecip(response) {
  let precipChanceResponse = response.data.hourly[0].pop;
  let currentPrecipChance = (precipChanceResponse * 100).toFixed(0);
  precipElement.innerHTML = `Precipitation: ${currentPrecipChance}%`;
}
function getWeather(coordinates) {
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let apiURL = `${apiEndpoint}onecall?units=${unit}&lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${apiKey}`;
  axios.get(apiURL).then(updatePrecip);
  axios.get(apiURL).then(displayForecast);
}
//
function displayTemp(response) {
  celsiusTemperature = response.data.main.temp;
  let humidityResponse = response.data.main.humidity;
  let windResponse = response.data.wind.speed;
  let windSpeed = Math.round(windResponse * 3.6);
  tempElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  windElement.innerHTML = `Wind: ${windSpeed} km/h`;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  humidityElement.innerHTML = `Humidity: ${humidityResponse}%`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getWeather(response.data.coord);
}

function citySearch(city) {
  let searchURL = `${apiEndpoint}weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(searchURL).then(displayTemp);
}
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  citySearch(cityInputElement.value);
}
//
function currentWeather(data1, data2) {
  celsiusTemperature = data1.main.temp;
  let currentTemp = Math.round(celsiusTemperature);
  let currentCity = data1.name;
  let description = document.querySelector("#description");
  let precipChanceResponse = data2.hourly[0].pop;
  let currentPrecipChance = (precipChanceResponse * 100).toFixed(0);
  let humidityResponse = data2.current.humidity;
  let windResponse = data2.current.wind_speed;
  let windSpeed = Math.round(windResponse * 3.6);
  precipElement.innerHTML = `Precipitation: ${currentPrecipChance}%`;
  humidityElement.innerHTML = `Humidity: ${humidityResponse}%`;
  windElement.innerHTML = `Wind: ${windSpeed} km/h`;
  tempElement.innerHTML = currentTemp;
  cityElement.innerHTML = currentCity;
  description.innerHTML = data1.weather[0].description;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data1.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", data1.weather[0].description);
}
function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function currentForecast(data2) {
  let forecast = data2.daily;
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-weekday">${formatForecastDay(
          forecastDay.dt
        )}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temps">
          <span class="weather-forecast-temps-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temps-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function returnPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiURL1 = `${apiEndpoint}weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
  let apiURL2 = `${apiEndpoint}onecall?units=${unit}&lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${apiKey}`;
  axios.get(`${apiURL1}`).then((response1) => {
    data1 = response1.data;
    axios.get(`${apiURL2}`).then((response2) => {
      data2 = response2.data;
      currentWeather(data1, data2);
      currentForecast(data2);
    });
  });
}
//
function displayTemperatureFahrenheit(event) {
  event.preventDefault();
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayTemperatureCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  tempElement.innerHTML = Math.round(celsiusTemperature);
}
//
let celsiusTemperature = null;
//
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);
//
let locationButton = document.querySelector("#current-location-button");
locationButton.addEventListener("click", function (event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(returnPosition);
});

let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");

celsiusLink.addEventListener("click", displayTemperatureCelsius);
fahrenheitLink.addEventListener("click", displayTemperatureFahrenheit);

navigator.geolocation.getCurrentPosition(returnPosition);
