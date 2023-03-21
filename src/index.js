let weekdayAndTime = document.querySelector("#weekday-and-time");
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
  weekdayAndTime.textContent = currentTime;
}
displayTime();
//
let searchCity = document.querySelector("#search-city");
let apiKey = "97f8e93f00107773f88eafd933ce86b7";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";

function citySearch(event) {
  event.preventDefault();
  let cityInputValue = document.querySelector("#city-input").value;
  let cityInput = `${cityInputValue}`;
  searchCity.textContent = cityInput;
  let units = `metric`;
  let apiURL = `${apiEndpoint}units=${units}&q=${cityInputValue}&appid=${apiKey}`;
  axios.get(`${apiURL}`).then(displayTemp);
}
function displayTemp(response) {
  let tempValue = Math.round(response.data.main.temp);
  let tempText = document.querySelector(".temperature");
  tempText.textContent = tempValue;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", citySearch);
//

let temperature = document.querySelector(".temperature");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");

function displayTemperatureCelsius() {
  temperature.textContent = "19";
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayTemperatureFahrenheit() {
  temperature.textContent = "66";
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

celsiusLink.addEventListener("click", displayTemperatureCelsius);
fahrenheitLink.addEventListener("click", displayTemperatureFahrenheit);
//
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let unit = "metric";
  let apiURL = `${apiEndpoint}units=${unit}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  function currentWeather(response) {
    let currentTemp = Math.round(response.data.main.temp);
    let currentCity = response.data.name;
    let tempText = document.querySelector(".temperature");
    let searchCity = document.querySelector("#search-city");
    tempText.textContent = currentTemp;
    searchCity.textContent = currentCity;
  }

  let locationButton = document.querySelector("#current-location-button");
  locationButton.addEventListener("click", function (event) {
    event.preventDefault();
    axios.get(`${apiURL}`).then(currentWeather);
  });
}

navigator.geolocation.getCurrentPosition(showPosition);
