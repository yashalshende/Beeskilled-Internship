import React from 'react';
import './EmptyState.css';

/**
 * Reusable EmptyState Component
 *
 * Demonstrates:
 * - Dynamic feedback message reflecting current search and filter queries
 * - Events: onReset handler to clear filters and recover list
 *
 * @param {Object} props
 * @param {string} [props.searchTerm]
 * @param {string} [props.category]
 * @param {Function} props.onReset
 */
export default function EmptyState({ searchTerm, category, onReset }) {
  return (
    <div className="empty-state-card" role="status" aria-live="polite">
      <div className="empty-state-icon" aria-hidden="true">
        🔎
      </div>
      <h3 className="empty-state-title">No matching articles found</h3>
      <p className="empty-state-text">
        {searchTerm && category !== 'All' ? (
          <>
            No posts found matching keyword <strong>"{searchTerm}"</strong> in category{' '}
            <strong>"{category}"</strong>.
          </>
        ) : searchTerm ? (
          <>
            No posts found containing the query <strong>"{searchTerm}"</strong>.
          </>
        ) : (
          <>No posts currently found in the category <strong>"{category}"</strong>.</>
        )}
      </p>
      <button type="button" className="empty-state-reset-btn" onClick={onReset}>
        Reset All Filters &amp; Search
      </button>
    </div>
  );
}
