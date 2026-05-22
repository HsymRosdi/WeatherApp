import { useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import Background from './components/Background'
import Footer from './components/Footer'


const API_KEY = 'ef40df6fd89345ec4a6f65a4ce72f35d' // 🔑 Replace with your OpenWeatherMap API key

function getWeatherTheme(id, isDay) {
  if (id >= 200 && id < 300) return 'thunderstorm'
  if (id >= 300 && id < 400) return 'drizzle'
  if (id >= 500 && id < 600) return 'rainy'
  if (id >= 600 && id < 700) return 'snowy'
  if (id >= 700 && id < 800) return 'foggy'
  if (id === 800) return isDay ? 'sunny' : 'night'
  if (id === 801 || id === 802) return isDay ? 'partly-cloudy' : 'night'
  if (id >= 803) return 'cloudy'
  return 'default'
}

export default function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('default')
  const [searched, setSearched] = useState(false)

  async function fetchWeather(city) {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setSearched(true)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      )
      if (!res.ok) {
        if (res.status === 404) throw new Error('City not found. Check the spelling and try again.')
        if (res.status === 401) throw new Error('Invalid API key.')
        throw new Error('Something went wrong. Please try again.')
      }
      const data = await res.json()
      const localTime = data.dt + data.timezone
      const sunriseLocal = data.sys.sunrise + data.timezone
      const sunsetLocal = data.sys.sunset + data.timezone
      const isDay = localTime >= sunriseLocal && localTime < sunsetLocal

      setWeather({ ...data, isDay })
      setTheme(getWeatherTheme(data.weather[0].id, isDay))
    } catch (err) {
      setError(err.message)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`app theme-${theme}`}>
      <Background theme={theme} />

      <div className="app-content">
        {/* Header */}
        <header className="app-header">
          <div className="logo-wrap">
            <span className="logo-dot" />
            <h1 className="logo-text">Weather Apps Suka Suka</h1>
          </div>
          <p className="logo-sub">search any location/city</p>
        </header>

        {/* Search */}
        <SearchBar onSearch={fetchWeather} loading={loading} />

        {/* Error */}
        {error && (
          <div className="error-card">
            <span className="error-icon">⚠</span>
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-wrap">
            <div className="loader">
              <div className="loader-ring" />
              <div className="loader-ring" style={{ animationDelay: '-0.3s' }} />
              <div className="loader-ring" style={{ animationDelay: '-0.6s' }} />
            </div>
            <p className="loading-text">Reading the atmosphere…</p>
          </div>
        )}

        {/* Weather Result */}
        {weather && !loading && <WeatherCard data={weather} theme={theme} />}

        {/* Empty state */}
        {!searched && !loading && (
          <div className="hero-hint">
            <p className="hero-line">What's the sky like</p>
            <p className="hero-line italic">anywhere on Earth?</p>
          </div>
        )}

        <Footer/>
      </div>
    </div>

  
  )
}