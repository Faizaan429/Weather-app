const apiKey = "8b3a98a28abe5b6c74f1f0953a4f9615";

// DOM Elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const locationBtn = document.getElementById("location-btn");
const themeToggle = document.getElementById("theme-toggle");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherSection = document.getElementById("weather-section");
const forecastSection = document.getElementById("forecast-section");

// Weather display elements
const cityName = document.getElementById("city-name");
const country = document.getElementById("country");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weather-icon");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const forecastCards = document.getElementById("forecast-cards");

// Theme management
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
});

function updateThemeIcon() {
  const icon = themeToggle.querySelector('i');
  if (currentTheme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

// Show/hide loading and error states
function showLoading() {
  loading.style.display = 'flex';
  weatherSection.style.display = 'none';
  forecastSection.style.display = 'none';
  error.style.display = 'none';
}

function hideLoading() {
  loading.style.display = 'none';
  weatherSection.style.display = 'block';
  forecastSection.style.display = 'block';
}

function showError(message) {
  error.style.display = 'flex';
  document.getElementById('error-message').textContent = message;
  weatherSection.style.display = 'none';
  forecastSection.style.display = 'none';
  loading.style.display = 'none';
}

// Get weather icon based on weather condition
function getWeatherIcon(weatherCode) {
  const icons = {
    '01': 'fa-sun',           // Clear sky
    '02': 'fa-cloud-sun',     // Few clouds
    '03': 'fa-cloud',         // Scattered clouds
    '04': 'fa-clouds',        // Broken clouds
    '09': 'fa-cloud-showers-heavy', // Shower rain
    '10': 'fa-cloud-rain',    // Rain
    '11': 'fa-bolt',          // Thunderstorm
    '13': 'fa-snowflake',     // Snow
    '50': 'fa-smog'           // Mist
  };
  
  const code = weatherCode.toString().substring(0, 2);
  return icons[code] || 'fa-cloud';
}

// Fetch Weather by City
async function getWeather(city) {
  try {
    showLoading();
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.cod === "404") {
      showError("City not found! Please check the spelling and try again.");
      return;
    }

    updateWeatherUI(data);
    hideLoading();

    // Fetch forecast
    await getForecast(city);
  } catch (error) {
    console.error("Error fetching weather:", error);
    showError("Failed to fetch weather data. Please check your internet connection and try again.");
  }
}

// Fetch Weather by Coordinates
async function getWeatherByCoords(lat, lon) {
  try {
    showLoading();
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    updateWeatherUI(data);
    hideLoading();

    // Fetch forecast
    await getForecastByCoords(lat, lon);
  } catch (error) {
    console.error("Error fetching weather by coords:", error);
    showError("Failed to fetch weather data for your location. Please try again.");
  }
}

// Update Weather UI
function updateWeatherUI(data) {
  cityName.textContent = data.name;
  country.textContent = data.sys.country;
  temperature.textContent = Math.round(data.main.temp);
  condition.textContent = data.weather[0].description;
  
  // Update weather icon
  const iconClass = getWeatherIcon(data.weather[0].id);
  weatherIcon.className = `weather-icon fas ${iconClass}`;
  
  // Update weather details
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  
  // Convert visibility from meters to kilometers
  const visibilityKm = (data.visibility / 1000).toFixed(1);
  visibility.textContent = `${visibilityKm} km`;
}

// Fetch Forecast by City
async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    displayForecast(data.list);
  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}

// Fetch Forecast by Coordinates
async function getForecastByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    displayForecast(data.list);
  } catch (error) {
    console.error("Error fetching forecast by coords:", error);
  }
}

// Display Forecast
function displayForecast(list) {
  forecastCards.innerHTML = ""; // Clear old forecast

  // Get one forecast per day (every 8th item as API returns 3-hour intervals)
  for (let i = 0; i < list.length; i += 8) {
    const forecast = list[i];
    const date = new Date(forecast.dt_txt);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const temp = Math.round(forecast.main.temp);
    const desc = forecast.weather[0].description;
    const iconClass = getWeatherIcon(forecast.weather[0].id);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${dayName}</h4>
      <p>${monthDay}</p>
      <i class="fas ${iconClass}" style="font-size: 1.5rem; color: var(--accent-color); margin: 0.5rem 0;"></i>
      <p>${temp} °C</p>
      <p>${desc}</p>
    `;
    forecastCards.appendChild(card);
  }
}

// Search functionality
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeather(city);
    }
  }
});

// Location button functionality
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    locationBtn.disabled = true;
    locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
        locationBtn.disabled = false;
        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Location';
      },
      (error) => {
        console.warn("Geolocation denied:", error);
        showError("Location access denied. Please search for a city manually.");
        locationBtn.disabled = false;
        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Location';
      }
    );
  } else {
    showError("Geolocation is not supported by your browser. Please search for a city manually.");
  }
});

// Auto-detect location on page load
window.addEventListener('load', () => {
  // Show default state
  weatherSection.style.display = 'block';
  forecastSection.style.display = 'block';
  
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
    // If browser doesn't support geolocation
    getWeather("London");
  }
});

// Add some nice animations and interactions
document.addEventListener('DOMContentLoaded', () => {
  // Add smooth transitions for weather cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Add focus styles for better accessibility
  const focusableElements = document.querySelectorAll('button, input');
  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.style.outline = '2px solid var(--primary-color)';
      element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
      element.style.outline = 'none';
    });
  });
});
