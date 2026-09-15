import React from 'react';
import './CategoryFilter.css';

/**
 * Reusable CategoryFilter Component
 *
 * Demonstrates:
 * - Dynamic rendering via categories.map()
 * - Props: categories array, selectedCategory, onSelectCategory, countsMap
 * - Events: onClick handler to switch active category
 *
 * @param {Object} props
 * @param {string[]} props.categories
 * @param {string} props.selectedCategory
 * @param {Function} props.onSelectCategory
 * @param {Object.<string, number>} [props.countsMap={}]
 */
export default function CategoryFilter({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  countsMap = {},
}) {
  return (
    <div className="category-filter-wrapper" role="tablist" aria-label="Filter articles by category">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        const count = countsMap[category];

        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={`category-pill ${isSelected ? 'category-pill-active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            <span className="category-pill-label">{category}</span>
            {count !== undefined && (
              <span className="category-pill-count" aria-label={`${count} articles`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
