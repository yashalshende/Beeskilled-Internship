import React, { useEffect } from 'react';
import './PostModal.css';

/**
 * Reusable PostModal Component
 *
 * Demonstrates:
 * - Controlled modal popup triggered by card select event
 * - Keyboard navigation: closes on Escape key
 * - Backdrop click to dismiss
 * - Accessibility: role="dialog", aria-modal="true"
 *
 * @param {Object} props
 * @param {Object|null} props.post
 * @param {Function} props.onClose
 */
export default function PostModal({ post, onClose }) {
  useEffect(() => {
    if (!post) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div
      className="post-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-post-title"
    >
      <div
        className="post-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header Media */}
        <div className="modal-media">
          <img src={post.image} alt={post.title} />
          <span className="modal-category-badge">{post.category}</span>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          <div className="modal-meta-row">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>

          <h2 id="modal-post-title" className="modal-title">
            {post.title}
          </h2>

          <div className="modal-content-text">
            <p className="modal-lead">{post.excerpt}</p>
            <hr className="modal-divider" />
            <p>{post.content}</p>
          </div>

          <div className="modal-tags-row">
            {post.tags.map((tag) => (
              <span key={tag} className="modal-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="modal-dismiss-btn" onClick={onClose}>
            Back to Articles
          </button>
        </div>
      </div>
    </div>
  );
}
