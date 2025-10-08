
const apiKey = "ca22a3468ac89c8d13db3310939c5de8";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + apiKey;

const search_box = document.querySelector(".search_bar input");
const search_btn = document.querySelector(".search_bar button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherCard = document.querySelector(".weather_card");
const body = document.body;
const errorMsg = document.querySelector(".error_msg");
const weatherContainer = document.querySelector(".weather_container");

const detailBox = document.querySelector(".detail-box");

// const pressureDesc = document.querySelector(".pressure");
const visibilityDesc = document.querySelector(".visibility");
const sunriseDesc = document.querySelector(".sunrise");
const sunsetDesc = document.querySelector(".sunset");




function updateWeatherUI(data) {
  document.querySelector(".city").textContent = data.name;
  document.querySelector(".temperature").innerHTML = `${data.main.temp}<sup style="font-size: 25px;">°C</sup>`;
  document.querySelector(".humidity").innerHTML = `${data.main.humidity}<sup>%</sup>`;
  document.querySelector(".wind").innerHTML = `${data.wind.speed}<sup>kmph</sup>`;



  document.querySelector(".pressure").innerHTML = `${data.main.pressure} <sup>hPa</sup>`;
  visibilityDesc.innerHTML = `${data.visibility / 1000} <sup>km</sup>`;
  sunriseDesc.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  sunsetDesc.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();

  weatherIcon.classList.add("animate");
  setTimeout(() => {
    weatherIcon.classList.remove("animate");
  }, 500);

  const mainWeather = data.weather[0].main;
  weatherIcon.src = `images/${mainWeather.toLowerCase()}.png`;
  weatherCard.className = `weather_card ${mainWeather.toLowerCase()}`;
  body.className = mainWeather.toLowerCase();

  weatherContainer.style.display = "block";
  errorMsg.style.display = "none";
}

async function checkWeather(city) {
  if (!city) {
    errorMsg.textContent = "Please enter a city name.";
    errorMsg.style.display = "block";
    weatherContainer.style.display = "none";
    return;
  }


  try {
    const response = await fetch(`${apiUrl}&q=${city}`);

    if (response.status === 404) {
      errorMsg.textContent = "Invalid city name! Enter valid city name.";
      errorMsg.style.display = "block";
      weatherContainer.style.display = "none";
      return;
    }

    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    errorMsg.textContent = "Failed to fetch weather data. Please try again later.";
    errorMsg.style.display = "block";
    weatherContainer.style.display = "none";
  }
}

function fetchWeatherByGeolocation() {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) {
          throw new Error("Failed to fetch weather for current location.");
        }
        const data = await response.json();
        updateWeatherUI(data);
      } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
        weatherContainer.style.display = "none";
      }
    },
    (error) => {
      console.log("Geolocation error:", error.message);
    }
  );
}

// Trigger animation on weather icon on page load
window.addEventListener("load", () => {
  weatherIcon.classList.add("animate");
  setTimeout(() => {
    weatherIcon.classList.remove("animate");
  }, 500);
  fetchWeatherByGeolocation();
});

search_btn.addEventListener("click", () => {
  checkWeather(search_box.value);
});

search_box.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(search_box.value);
  }
});
