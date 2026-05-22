import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(city)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          type="text"
          placeholder="Enter a city name…"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button className="search-btn" type="submit" disabled={loading || !city.trim()}>
          {loading ? '…' : 'Search'}
        </button>
      </div>
    </form>
  )
}