import WeatherDetails from './WeatherDetails'

// Returns a large emoji icon based on weather condition ID
function getWeatherEmoji(id, isDay) {
  if (id >= 200 && id < 300) return '⛈️'
  if (id >= 300 && id < 400) return '🌦️'
  if (id >= 500 && id < 600) return '🌧️'
  if (id >= 600 && id < 700) return '❄️'
  if (id >= 700 && id < 800) return '🌫️'
  if (id === 800) return isDay ? '☀️' : '🌙'
  if (id === 801) return isDay ? '🌤️' : '🌙'
  if (id === 802) return '⛅'
  if (id >= 803) return '☁️'
  return '🌈'
}

export default function WeatherCard({ data }) {
  const {
    name,
    sys,
    main,
    weather,
    wind,
    isDay,
  } = data

  const condition = weather[0]
  const emoji = getWeatherEmoji(condition.id, isDay)

  // Format local time
  const localTimestamp = (data.dt + data.timezone) * 1000
  const localDate = new Date(localTimestamp)
  const timeString = localDate.toUTCString().slice(0, 22) // e.g. "Fri, 23 May 2025 14:30"

  // Feels-like descriptor
  const feelsLikeDiff = main.feels_like - main.temp
  let feelsDesc = 'feels similar'
  if (feelsLikeDiff <= -3) feelsDesc = 'feels colder'
  if (feelsLikeDiff >= 3) feelsDesc = 'feels warmer'

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="weather-icon">{emoji}</div>
        <div className="weather-location">
          <h2 className="city-name">{name}, {sys.country}</h2>
          <p className="local-time">{timeString} local time</p>
        </div>
      </div>

      <div className="weather-temp-block">
        <span className="temperature">{Math.round(main.temp)}°</span>
        <span className="temp-unit">C</span>
      </div>

      <p className="weather-condition">{condition.description}</p>
      <p className="feels-like">
        Feels like {Math.round(main.feels_like)}° · {feelsDesc}
      </p>

      <WeatherDetails
        humidity={main.humidity}
        windSpeed={wind.speed}
        tempMin={main.temp_min}
        tempMax={main.temp_max}
        iconUrl={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
      />
    </div>
  )
}