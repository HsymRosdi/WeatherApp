import { useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'

const API_KEY = 'YOUR_API_KEY_HERE' // 🔑 Replace with your OpenWeatherMap API key

// Maps weather condition IDs to background themes
function getWeatherTheme(weatherId, isDay) {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm'
  if (weatherId >= 300 && weatherId < 400) return 'drizzle'
  if (weatherId >= 500 && weatherId < 600) return 'rainy'
  if (weatherId >= 600 && weatherId < 700) return 'snowy'
  if (weatherId >= 700 && weatherId < 800) return 'foggy'
  if (weatherId === 800) return isDay ? 'sunny' : 'clear-night'
  if (weatherId === 801 || weatherId === 802) return 'partly-cloudy'
  if (weatherId >= 803) return 'cloudy'
  return 'default'
}

export default function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('default')

  async function fetchWeather(city) {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      )
      if (!res.ok) {
        if (res.status === 404) throw new Error('City not found. Try another name.')
        if (res.status === 401) throw new Error('Invalid API key. Check your key.')
        throw new Error('Something went wrong. Please try again.')
      }
      const data = await res.json()

      // Determine day/night using sunrise/sunset + timezone offset
      const localTime = data.dt + data.timezone
      const sunriseLocal = data.sys.sunrise + data.timezone
      const sunsetLocal = data.sys.sunset + data.timezone
      const isDay = localTime >= sunriseLocal && localTime < sunsetLocal

      setWeather({ ...data, isDay })
      setTheme(getWeatherTheme(data.weather[0].id, isDay))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`app theme-${theme}`}>
      <div className="app-overlay" />
      <div className="app-content">
        <header className="app-header">
          <h1 className="app-logo">Skies</h1>
          <p className="app-tagline">Real-time weather, beautifully presented</p>
        </header>

        <SearchBar onSearch={fetchWeather} loading={loading} />

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span> {error}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Fetching skies…</p>
          </div>
        )}

        {weather && !loading && <WeatherCard data={weather} />}

        {!weather && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <p>Search for any city to see the weather</p>
          </div>
        )}
      </div>
    </div>
  )
}