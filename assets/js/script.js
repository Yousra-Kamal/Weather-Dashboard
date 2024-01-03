//Variables
var APIKey = "68f015581e2215be9b18cbb65775c72a";
var inputEl = document.querySelector("#searchedCity");
var submitBtn = document.querySelector("#submit");
var historyEl = document.querySelector("#history");
var cityTitle = document.querySelector("#cityTitle");
var weatherEl = document.querySelector("#weather");
var forecastTitle = document.querySelector("#forecast-title");
var forecastEl = document.querySelector("#forecast");

// Displays History searches stored in local storage
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
function init() {
  for (var search of searchHistory) {
    var historyBtn = document.createElement("button");
    historyBtn.textContent = search;
    historyEl.appendChild(historyBtn);
  }
}

// Get the longitude and latitude of the city
function getLocation(city) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city} 
    &limit=1&appid=${APIKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      /*console.log("DATA:", data);*/
      var lat = data[0].lat;
      var lon = data[0].lon;

      getCityWeather(city, lat, lon);
    });
}

// Gets weather data of the city
function getCityWeather(city, lat, lon) {
  //Fetches weather data from OpenWeatherMap https://api.openweathermap.org/data/3.0/onecall,
  //THIS API IS NOT PART OF THE FREE APIs, IN ORDER TO ACCESS IT I HAD TO SUBSCRIBE TO One Call 3.0 API subscription.
  fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}&units=metric`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      /* console.log("DATA", data); */
      // Clear and reset city title
      cityTitle.textContent = "";
      // city title and current date
      cityTitle.textContent = city + ": " + moment().format(" DD / MM / YYYY ");

      currentWeather(data);
      forecastWeather(data);
    });
}
// display CURRENT weather data
function currentWeather(data) {
  // Clear and reset element
  weatherEl.textContent = "";
  var icon = data.current.weather[0].icon;
  var weatherImg = document.createElement("img");
  weatherImg.setAttribute("src", `http://openweathermap.org/img/w/${icon}.png`);
  weatherEl.appendChild(weatherImg);

  var weatherData = [
    "Temp:  " + Math.round(data.current.temp) + " °C",
    "Wind: " + data.current.wind_speed + " mph",
    "Humidity: " + data.current.humidity + " %",
  ];
  for (var item of weatherData) {
    var weatherItem = document.createElement("p");
    weatherItem.textContent = item;
    weatherEl.appendChild(weatherItem);
  }

  var divider = document.createElement("hr");
  weatherEl.appendChild(divider);
}

function forecastWeather(data) {
  console.log("DATA", data);
  forecastEl.innerHTML = "";
  forecastTitle.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  // 5-DAY weather data,
  for (var i = 1; i <= 5; i++) {
    var date = data.daily[i].dt;
    var icon = data.daily[i].weather[0].icon;
    var temp = "Temp: " + Math.round(data.daily[i].temp.day) + " °C";
    var wind = "Wind: " + data.daily[i].wind_speed + " mph";
    var humidity = "Humidity: " + data.daily[i].humidity + " %";

    // CREATE card elements
    var forecastCard = document.createElement("article");
    var dateItem = document.createElement("h3");
    var iconItem = document.createElement("img");
    var tempItem = document.createElement("p");
    var windItem = document.createElement("p");
    var humidityItem = document.createElement("p");

    // Each element data
    dateItem.textContent = moment(date, "X").format(" DD / MM / YYYY ");
    iconItem.setAttribute("src", `http://openweathermap.org/img/w/${icon}.png`);
    tempItem.textContent = temp;
    windItem.textContent = wind;
    humidityItem.textContent = humidity;

    // Appended to the card
    forecastCard.appendChild(dateItem);
    forecastCard.appendChild(iconItem);
    forecastCard.appendChild(tempItem);
    forecastCard.appendChild(windItem);
    forecastCard.appendChild(humidityItem);

    //  displaye acrd on the page;
    forecastEl.appendChild(forecastCard);
  }
}

//Listen for a click event on submitBtn
//save the city into local storage
submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var cityInput = inputEl.value.trim();
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  if (!searchHistory.includes(cityInput)) {
    var historyBtn = document.createElement("button");
    historyBtn.textContent = cityInput;
    historyEl.appendChild(historyBtn);
    searchHistory.push(cityInput);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  getLocation(cityInput);
  inputEl.value = "";
});

 
historyEl.addEventListener("click", function (event) {
  event.preventDefault();
  var historyBtn = event.target;
  if (historyBtn.matches("button")) {
    console.log(historyBtn);
    getLocation(historyBtn.textContent);
  }
});

var clearHistory = document.createElement("a");
clearHistory.style.color = "#fff";
clearHistory.textContent = "Clear";
historyEl.appendChild(clearHistory);

clearHistory.addEventListener("click", function () {
  localStorage.clear();
  historyEl.textContent = "";
  weatherEl.textContent = "";
  forecastEl.textContent = "";
  forecastTitle.textContent = "";
  cityTitle.textContent = "";
  historyEl.appendChild(clearHistory);
});

init();
