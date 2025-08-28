const apiKey = "8b3a98a28abe5b6c74f1f0953a4f9615"; // only the key

// Elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecastCards = document.getElementById("forecast-cards");

// Fetch Weather by City
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod === "404") {
      alert("City not found!");
      return;
    }

    updateWeatherUI(data);

    // Fetch forecast using city
    getForecast(city);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Fetch Weather by Coordinates
async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    updateWeatherUI(data);

    // Fetch forecast using coordinates
    getForecastByCoords(lat, lon);
  } catch (error) {
    console.error("Error fetching weather by coords:", error);
  }
}

// Update Weather UI
function updateWeatherUI(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)} °C`;
  condition.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
}

// Fetch Forecast by City
async function getForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  displayForecast(data.list);
}

// Fetch Forecast by Coordinates
async function getForecastByCoords(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  displayForecast(data.list);
}

// Display Forecast
function displayForecast(list) {
  forecastCards.innerHTML = ""; // Clear old forecast

  for (let i = 0; i < list.length; i += 8) {
    const forecast = list[i];
    const date = new Date(forecast.dt_txt).toLocaleDateString();
    const temp = Math.round(forecast.main.temp);
    const desc = forecast.weather[0].description;

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h4>${date}</h4>
      <p>${temp} °C</p>
      <p>${desc}</p>
    `;
    forecastCards.appendChild(card);
  }
}

// Search on Button Click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

// Search on "Enter"
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeather(city);
    }
  }
});

// 🔹 Auto Detect Location on Page Load
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      (error) => {
        console.warn("Geolocation denied, showing default city.");
        getWeather("London"); // fallback city
      }
    );
  } else {
    // If browser doesn’t support geolocation
    getWeather("London");
  }
};
