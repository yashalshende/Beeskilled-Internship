import React from 'react';
import './BlogCard.css';

/**
 * Reusable BlogCard Component
 *
 * Demonstrates:
 * - Dynamic data received via props (post object)
 * - Dynamic rendering of tags via .map()
 * - Events: onSelect callback when clicking the card or Read More button
 *
 * @param {Object} props
 * @param {Object} props.post
 * @param {Function} props.onSelect
 */
export default function BlogCard({ post, onSelect }) {
  if (!post) return null;

  const {
    title,
    category,
    author,
    date,
    readTime,
    image,
    excerpt,
    tags = [],
  } = post;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(post);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect fill="%231E293B" width="100%" height="100%"/><text fill="%23818CF8" font-family="sans-serif" font-size="28" font-weight="bold" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(category)} Article</text></svg>`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className="blog-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Read article: ${title}`}
    >
      {/* Article Media Cover */}
      <div className="blog-card-media">
        <img src={image} alt={title} loading="lazy" onError={handleImageError} />
        <span className="blog-category-badge">{category}</span>
      </div>

      {/* Article Body */}
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="blog-date">{date}</span>
          <span className="meta-bullet">•</span>
          <span className="blog-read-time">{readTime}</span>
        </div>

        <h3 className="blog-card-title">{title}</h3>

        <p className="blog-card-excerpt">{excerpt}</p>

        {/* Dynamic Tags */}
        {tags.length > 0 && (
          <div className="blog-card-tags">
            {tags.map((tag, idx) => (
              <span key={`${tag}-${idx}`} className="blog-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="blog-card-footer">
        <div className="blog-author-info">
          <div className="author-avatar" aria-hidden="true">
            {author.charAt(0)}
          </div>
          <span className="author-name">{author}</span>
        </div>

        <button
          type="button"
          className="read-more-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          aria-label={`Read full post: ${title}`}
        >
          Read Article →
        </button>
      </div>
    </article>
  );
}
