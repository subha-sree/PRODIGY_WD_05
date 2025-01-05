const API_KEY = "a45ea3a219e9217cd8666ac3d4b2f2c6"; // Your OpenWeatherMap API Key
const weatherInfo = document.getElementById("weatherInfo");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const localTime = document.getElementById("localTime");
const forecastList = document.getElementById("forecastList");

document.getElementById("searchBtn").addEventListener("click", () => {
  const location = document.getElementById("locationInput").value.trim();
  if (location) {
    fetchWeather(location);
  } else {
    alert("Please enter a location.");
  }
});

document.getElementById("currentLocationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoordinates(lat, lon);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your location. Please try again.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

function fetchWeather(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
  console.log("Fetching weather for:", location); // Debugging log
  console.log("API URL:", url); // Debugging log

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          console.error("Error from API:", data); // Log full error response
          throw new Error(data.message || "Location not found. Please try again.");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data); // Log the successful response
      displayWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    })
    .catch((error) => {
      console.error("Error fetching weather:", error.message);
      alert(error.message);
    });
}

function fetchWeatherByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  console.log("Fetching weather for coordinates:", lat, lon); // Debugging log
  console.log("API URL:", url); // Debugging log

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
      fetchForecast(lat, lon);
    })
    .catch((error) => {
      console.error("Fetch Weather By Coordinates Error:", error.message);
      alert("Unable to fetch weather data.");
    });
}

function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  console.log("Fetching forecast for coordinates:", lat, lon); // Debugging log

  fetch(url)
    .then((response) => response.json())
    .then((data) => displayForecast(data))
    .catch((error) => {
      console.error("Fetch Forecast Error:", error.message);
      alert("Unable to fetch forecast data.");
    });
}

function displayWeather(data) {
  cityName.textContent = data.name || "Unknown Location";
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  description.textContent = `Condition: ${data.weather[0].description}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  const localTimeDate = new Date((data.dt + data.timezone) * 1000);
  localTime.textContent = `Local Time: ${localTimeDate.toLocaleTimeString()}`;
  weatherInfo.style.display = "block";
}

function displayForecast(data) {
  forecastList.innerHTML = ""; // Clear previous forecast
  const forecasts = data.list.slice(0, 5); // First 5 forecasts
  forecasts.forEach((forecast) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${new Date(forecast.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}: ${forecast.main.temp}°C, ${forecast.weather[0].description}`;
    forecastList.appendChild(listItem);
  });
}
