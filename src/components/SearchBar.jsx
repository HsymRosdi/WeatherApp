import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (city.trim()) onSearch(city.trim())
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-glass">
        <svg className="search-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="search-input"
          type="text"
          placeholder="Search a city…"
          value={city}
          onChange={e => setCity(e.target.value)}
          disabled={loading}
          autoFocus
          autoComplete="off"
        />
        <button
          className="search-btn"
          type="submit"
          disabled={loading || !city.trim()}
        >
          {loading ? (
            <span className="btn-spinner" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}