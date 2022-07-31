const apiId = "45a279e4eb49922fc1c93e07d331e80a";

let currentCityTemps = null;

window.addEventListener("load", function () {
  console.log("All assets are loaded");
  setCurrentTime();
});

function setCurrentTime() {
  let timeNow = new Date();
  let liDate = document.querySelector("#date");
  let day = getDay(timeNow.getDay());
  let hour = timeNow.getHours();
  let minute = String(timeNow.getMinutes()).padStart(2, "0");

  liDate.innerHTML = `${day} ${hour}:${minute}`;
}

function getDay(day) {
  let days = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];
  return days[day];
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(getWeatherForLocation);
}

function getWeatherForLocation(location) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiId}&units=metric`;
  axios.get(apiUrl).then(updateCityFromLocation);
}

function updateCityFromLocation(response) {
  currentCityTemps = response;
  let h1City = document.querySelector("#city");
  h1City.innerHTML = currentCityTemps.data.name;

  setWind(response);
  setHumidity(response);
  setCurrentTime();
  setTemperaturesForCity("C");
}
function setWind(response) {
  let windInput = document.querySelector("#wind");
  windInput.innerHTML = Math.round(response.data.wind.speed);
}

function setHumidity(response) {
  let humidityInput = document.querySelector("#humidity");
  humidityInput.innerHTML = response.data.main.humidity;
}
function getWeatherForSearch(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiId}&units=metric`;
  axios.get(apiUrl).then(updateCityFromLocation);
}

function updateCityFromSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let h1City = document.querySelector("#city");

  h1City.innerHTML = capitalizeFirstLetter(cityInput.value);
  setCurrentTime();
  getWeatherForSearch(cityInput.value);
}

document
  .querySelector("#search-form")
  .addEventListener("submit", updateCityFromSearch);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function setTemperaturesForCity(unit) {
  let roundedCelcuis = Math.round(currentCityTemps.data.main.temp);
  let roundedFahrenheit = Math.round(
    currentCityTemps.data.main.temp * (9 / 5) + 32
  );
  let sTemperature = document.querySelector("#temp");
  if (unit === "C") {
    sTemperature.innerHTML = roundedCelcuis;
  } else {
    sTemperature.innerHTML = roundedFahrenheit;
  }
  let description = document.querySelector("#description");

  description.innerHTML = currentCityTemps.data.weather[0].main;
  let icon = document.querySelector("#iconimage");

  icon.src = `https://raw.githubusercontent.com/hasankoroglu/OpenWeatherMap-Icons/master/icons/${currentCityTemps.data.weather[0].icon}@2x.png`;
}

function showC() {
  setTemperaturesForCity("C");
}

function showF() {
  setTemperaturesForCity("F");
}

document.querySelector("#celsius-link").addEventListener("click", showC);
document.querySelector("#fahrenheit-link").addEventListener("click", showF);
