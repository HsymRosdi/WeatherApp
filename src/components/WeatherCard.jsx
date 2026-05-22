function getEmoji(id, isDay) {
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

function getAQLabel(humidity) {
  if (humidity < 30) return { label: 'Dry', color: '#f9ca56' }
  if (humidity < 60) return { label: 'Comfortable', color: '#56f9a0' }
  if (humidity < 80) return { label: 'Humid', color: '#56c8f9' }
  return { label: 'Very Humid', color: '#a056f9' }
}

export default function WeatherCard({ data, theme }) {
  const { name, sys, main, weather, wind, isDay, visibility } = data
  const cond = weather[0]
  const emoji = getEmoji(cond.id, isDay)
  const humidity = getAQLabel(main.humidity)

  // Format time
  const utcMs = (data.dt + data.timezone) * 1000
  const d = new Date(utcMs)
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dayName = days[d.getUTCDay()]
  const dateStr = `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
  const hours = String(d.getUTCHours()).padStart(2, '0')
  const mins = String(d.getUTCMinutes()).padStart(2, '0')
  const timeStr = `${hours}:${mins}`

  const visKm = visibility ? (visibility / 1000).toFixed(1) : '—'

  return (
    <div className="wcard">
      {/* Top strip — location + time */}
      <div className="wcard-top">
        <div className="wcard-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="wcard-city">{name}, {sys.country}</span>
        </div>
        <div className="wcard-time">
          <span className="wcard-clock">{timeStr}</span>
          <span className="wcard-date">{dayName}, {dateStr}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="wcard-divider" />

      {/* Main temp block */}
      <div className="wcard-main">
        <div className="wcard-emoji">{emoji}</div>
        <div className="wcard-temp-block">
          <div className="wcard-temp">
            {Math.round(main.temp)}
            <span className="wcard-deg">°C</span>
          </div>
          <div className="wcard-desc">{cond.description}</div>
          <div className="wcard-feels">
            Feels like <strong>{Math.round(main.feels_like)}°C</strong>
            &nbsp;·&nbsp;
            <span className="wcard-minmax">↑{Math.round(main.temp_max)}° ↓{Math.round(main.temp_min)}°</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="wcard-stats">
        <StatTile
          icon={<HumidityIcon />}
          value={`${main.humidity}%`}
          label="Humidity"
          badge={humidity.label}
          badgeColor={humidity.color}
        />
        <StatTile
          icon={<WindIcon />}
          value={`${wind.speed} m/s`}
          label="Wind Speed"
          sub={wind.deg ? `${wind.deg}°` : null}
        />
        <StatTile
          icon={<EyeIcon />}
          value={`${visKm} km`}
          label="Visibility"
        />
        <StatTile
          icon={<PressureIcon />}
          value={`${main.pressure}`}
          label="Pressure hPa"
        />
      </div>

      {/* OWM icon strip */}
      <div className="wcard-footer">
        <img
          src={`https://openweathermap.org/img/wn/${cond.icon}@2x.png`}
          alt={cond.description}
          className="wcard-owm-icon"
        />
        <span className="wcard-powered">Powered by OpenWeatherMap</span>
      </div>
    </div>
  )
}

function StatTile({ icon, value, label, badge, badgeColor, sub }) {
  return (
    <div className="stat-tile">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {badge && <span className="stat-badge" style={{ color: badgeColor, borderColor: badgeColor }}>{badge}</span>}
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

function HumidityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z"/>
    </svg>
  )
}

function WindIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function PressureIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  )
}