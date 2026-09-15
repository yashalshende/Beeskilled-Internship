import React from 'react';
import './SearchBar.css';

/**
 * Reusable SearchBar Component
 *
 * Demonstrates:
 * - Controlled input props: searchTerm, onSearchChange, onClearSearch
 * - Events: onChange, onKeyDown (Escape to clear)
 * - Accessibility: aria-label, clear button with accessible title
 *
 * @param {Object} props
 * @param {string} props.searchTerm
 * @param {Function} props.onSearchChange
 * @param {Function} props.onClearSearch
 * @param {string} [props.placeholder]
 */
export default function SearchBar({
  searchTerm,
  onSearchChange,
  onClearSearch,
  placeholder = 'Search articles by title, content, or keywords...',
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && searchTerm) {
      onClearSearch();
    }
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-input-container">
        {/* Search Icon */}
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>

        <input
          type="search"
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search articles"
        />

        {/* Clear Search Action */}
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClearSearch}
            aria-label="Clear search input"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
