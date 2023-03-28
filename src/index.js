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
  weekdayAndTime.innerHTML = currentTime;
}
displayTime();
//
let apiKey = "97f8e93f00107773f88eafd933ce86b7";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/";
let unit = `metric`;
let cityElement = document.querySelector("#city");
let precipElement = document.querySelector("#precip");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let tempElement = document.querySelector(".temperature");

function citySearch(event) {
  event.preventDefault();
  let cityInputValue = document.querySelector("#city-input").value;
  let apiURL = `${apiEndpoint}weather?units=${unit}&q=${cityInputValue}&appid=${apiKey}`;
  axios.get(`${apiURL}`).then(displayTemp);
  //axios.get(`${apiURL2}`).then(displayExtras);
}
function displayTemp(response) {
  let tempValue = Math.round(response.data.main.temp);
  let description = document.querySelector("#description");
  tempElement.innerHTML = tempValue;
  cityElement.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}
//function displayExtras(response) {
//let precipResponse = response.data
//let apiURL2 = `${apiEndpoint}`}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", citySearch);
//

let temperature = document.querySelector(".temperature");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");

function displayTemperatureCelsius() {
  temperature.innerHTML = "19";
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayTemperatureFahrenheit() {
  temperature.innerHTML = "66";
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

celsiusLink.addEventListener("click", displayTemperatureCelsius);
fahrenheitLink.addEventListener("click", displayTemperatureFahrenheit);
//
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiURL1 = `${apiEndpoint}weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
  let apiURL2 = `${apiEndpoint}onecall?units=${unit}&lat=${latitude}&lon=${longitude}&exclude=minutely,daily&appid=${apiKey}`;
  function currentWeather(data1, data2) {
    let currentTemp = Math.round(data1.main.temp);
    let currentCity = data1.name;
    let description = document.querySelector("#description");
    let precipChanceResponse = data2.hourly[0].pop;
    let currentPrecipChance = (precipChanceResponse * 100).toFixed(0);
    let currentPrecipExtra = `Precipitation: ${currentPrecipChance}%`;
    let humidityResponse = data2.current.humidity;
    let windResponse = data2.current.wind_speed;
    let windSpeed = Math.round(windResponse * 3.6);
    precipElement.innerHTML = currentPrecipExtra;
    humidityElement.innerHTML = `Humidity: ${humidityResponse}%`;
    windElement.innerHTML = `Wind: ${windSpeed} km/h`;
    tempElement.innerHTML = currentTemp;
    cityElement.innerHTML = currentCity;
    description.innerHTML = data1.weather[0].description;
  }
  let locationButton = document.querySelector("#current-location-button");
  locationButton.addEventListener("click", function (event) {
    event.preventDefault();
    axios.get(`${apiURL1}`).then((response1) => {
      data1 = response1.data;
      axios.get(`${apiURL2}`).then((response2) => {
        data2 = response2.data;
        combinedData = {
          data1: data1,
          data2: data2,
        };
        currentWeather(data1, data2);
      });
    });
  });
}

navigator.geolocation.getCurrentPosition(showPosition);
