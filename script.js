const apiKey = '3bf05f6e1a8c7c40f28db5064ff96295';
let isCelsius = true;

document.getElementById('search-btn').addEventListener('click', getWeather);
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
document.getElementById('unit-toggle').addEventListener('click', toggleUnit);

function getWeather() {
    const city = document.getElementById('city').value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                getForecast(data.coord.lat, data.coord.lon);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayWeather(data) {
    const location = document.getElementById('location');
    const weatherIcon = document.getElementById('weather-icon');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');

    location.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    temperature.textContent = `${data.main.temp}°C`;
    description.textContent = data.weather[0].description;

    document.getElementById('weather-info').style.display = 'block';
}

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const labels = data.list.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            const temps = data.list.map(item => item.main.temp);
            displayChart(labels, temps);
        })
        .catch(error => console.error('Error:', error));
}

function displayChart(labels, temps) {
    const ctx = document.getElementById('weather-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function toggleUnit() {
    const temperature = document.getElementById('temperature');
    const temp = parseFloat(temperature.textContent);
    if (isNaN(temp)) return;

    if (isCelsius) {
        temperature.textContent = `${((temp * 9 / 5) + 32).toFixed(2)}°F`;
    } else {
        temperature.textContent = `${((temp - 32) * 5 / 9).toFixed(2)}°C`;
    }

    isCelsius = !isCelsius;
}
