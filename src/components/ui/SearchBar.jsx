import React, { useState, useEffect } from 'react'
import { debounce } from '../../utils/apiHelpers'

const SearchBar = ({ onSearch, initialValue = '', placeholder = "Buscar productos..." }) => {
  const [query, setQuery] = useState(initialValue)

  // Debounce search to avoid too many API calls
  const debouncedSearch = debounce((searchQuery) => {
    onSearch(searchQuery)
  }, 500)

  useEffect(() => {
    if (query !== initialValue) {
      debouncedSearch(query)
    }
  }, [query, debouncedSearch, initialValue])

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__container">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-bar__input"
        />
        {query && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
          >
            ×
          </button>
        )}
        <button type="submit" className="search-bar__submit">
          🔍
        </button>
      </div>
    </form>
  )
}

export default SearchBar
