export default function WeatherDetails({ humidity, windSpeed, tempMin, tempMax, iconUrl }) {
  const details = [
    { icon: '💧', label: 'Humidity', value: `${humidity}%` },
    { icon: '💨', label: 'Wind Speed', value: `${windSpeed} m/s` },
    { icon: '🌡️', label: 'High / Low', value: `${Math.round(tempMax)}° / ${Math.round(tempMin)}°` },
  ]

  return (
    <div className="weather-details">
      {details.map((d) => (
        <div className="detail-pill" key={d.label}>
          <span className="detail-emoji">{d.icon}</span>
          <div className="detail-text">
            <span className="detail-value">{d.value}</span>
            <span className="detail-label">{d.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}