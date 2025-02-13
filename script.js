const apiKey = 'f29f9c6e573a4d18fa1e22024606de55'; 

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');
const toggleUnit = document.getElementById('toggle-unit');
const errorMessage = document.getElementById('error-message');
const suggestionsBox = document.getElementById('suggestions-box');

let isCelsius = true;

// List of Indian cities (Add more if needed)
const indianCities = [
    "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
    "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam", "Bhopal", "Patna", "Ludhiana",
    "Thane", "Indore", "Varanasi", "Ranchi", "Shimla", "Manali", "Darjeeling", "Ooty",
    "Mussoorie", "Coorg", "Munnar", "Nainital", "Shillong", "Gangtok", "Goa", "Kochi",
    "Kanyakumari", "Puducherry"
];

// Fetch weather data
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
        errorMessage.textContent = '';
    } catch (error) {
        errorMessage.textContent = 'City not found. Please try again.';
        clearWeatherData();
    }
}

// Display weather data and update background
function displayWeather(data) {
    cityName.textContent = data.name;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.classList.add('fade-in');

    if (isCelsius) {
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
    } else {
        temperature.textContent = `${Math.round((data.main.temp * 9) / 5 + 32)}°F`;
    }

    // Get weather condition (e.g., Clear, Clouds, Rain, etc.)
    const weatherCondition = data.weather[0].main.toLowerCase();
    changeBackground(weatherCondition);
}

// Change the background based on weather condition
function changeBackground(weather) {
    const backgrounds = {
        clear: "linear-gradient(135deg, #ffcc33, #ff8800)",  // Sunny
        clouds: "linear-gradient(135deg, #90a4ae, #546e7a)",  // Cloudy
        rain: "linear-gradient(135deg, #4a90e2, #0072ff)",  // Rainy
        thunderstorm: "linear-gradient(135deg, #2c3e50, #4ca1af)",  // Stormy
        snow: "linear-gradient(135deg, #dbeafe, #6fa3ef)",  // ❄️ Snow (Light Blue & White)
        mist: "linear-gradient(135deg, #a8c0ff, #3f2b96)",  // 🌫️ Mist (Cool Blue & Dark Purple)
        haze: "linear-gradient(135deg, #ffc371, #ff5f6d)",  // 🌫️ Haze (Warm Orange & Soft Red)
        fog: "linear-gradient(135deg, #828282, #414141)",  // Foggy
        drizzle: "linear-gradient(135deg, #9cb4cc, #6b7b8a)",  // Drizzle
        default: "linear-gradient(135deg, #1e3c72, #2a5298)"  // Default Background
    };

    // Apply the background
    document.body.style.background = backgrounds[weather] || backgrounds.default;
}

// Clear weather data
function clearWeatherData() {
    cityName.textContent = 'City Name';
    temperature.textContent = '--°C';
    weatherDescription.textContent = 'Weather Description';
    humidity.textContent = 'Humidity: --%';
    windSpeed.textContent = 'Wind Speed: -- m/s';
    weatherIcon.src = '';
}

// Toggle temperature unit
toggleUnit.addEventListener('click', () => {
    isCelsius = !isCelsius;
    if (cityName.textContent !== 'City Name') {
        fetchWeather(cityName.textContent);
    }
});

// Search for weather
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

// Show live dropdown suggestions
cityInput.addEventListener('input', () => {
    let inputText = cityInput.value.toLowerCase();
    let filteredCities = indianCities.filter(city => city.toLowerCase().startsWith(inputText));

    // Show suggestions
    suggestionsBox.innerHTML = "";
    if (inputText && filteredCities.length > 0) {
        suggestionsBox.style.display = "block";
        filteredCities.forEach(city => {
            let suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.textContent = city;
            suggestionItem.addEventListener("click", () => {
                cityInput.value = city;
                suggestionsBox.style.display = "none";
                fetchWeather(city);
            });
            suggestionsBox.appendChild(suggestionItem);
        });
    } else {
        suggestionsBox.style.display = "none";
    }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (e.target !== cityInput) {
        suggestionsBox.style.display = "none";
    }
});
