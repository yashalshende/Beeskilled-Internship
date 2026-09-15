import React from 'react';
import './Card.css';

/**
 * Reusable Card Component
 *
 * Demonstrates:
 * - Props: variant, image, imageAlt, badge, badgeVariant, title, subtitle, tags, footerAction, onClick, children
 * - Dynamic rendering: tags mapped dynamically, image & badge rendered conditionally
 * - Events: onClick handler when card is clicked (supports interactive mode)
 *
 * @param {Object} props
 * @param {'default'|'elevated'|'interactive'|'product'|'horizontal'} [props.variant='default']
 * @param {string} [props.image]
 * @param {string} [props.imageAlt]
 * @param {string} [props.badge]
 * @param {'primary'|'success'|'warning'|'accent'} [props.badgeVariant='primary']
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {string[]} [props.tags]
 * @param {React.ReactNode} [props.footerAction]
 * @param {Function} [props.onClick]
 * @param {React.ReactNode} [props.children]
 */
export default function Card({
  variant = 'default',
  image,
  imageAlt = 'Card media',
  badge,
  badgeVariant = 'primary',
  title,
  subtitle,
  tags = [],
  footerAction,
  onClick,
  children,
  className = '',
  ...rest
}) {
  const isClickable = Boolean(onClick);

  const cardClasses = [
    'rc-card',
    `rc-card-${variant}`,
    isClickable ? 'rc-card-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleKeyDown = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <article
      className={cardClasses}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {/* Optional Media Element */}
      {image && (
        <div className="rc-card-media-wrapper">
          <img src={image} alt={imageAlt} className="rc-card-media" loading="lazy" />
          {badge && (
            <span className={`rc-card-badge rc-badge-${badgeVariant}`}>
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Card Header Content */}
      <div className="rc-card-body">
        {!image && badge && (
          <div className="rc-card-badge-row">
            <span className={`rc-card-badge rc-badge-${badgeVariant}`}>
              {badge}
            </span>
          </div>
        )}

        {title && <h3 className="rc-card-title">{title}</h3>}
        {subtitle && <p className="rc-card-subtitle">{subtitle}</p>}

        {/* Dynamic Body Content */}
        {children && <div className="rc-card-content">{children}</div>}

        {/* Dynamic Tags Rendering */}
        {tags && tags.length > 0 && (
          <div className="rc-card-tags">
            {tags.map((tag, idx) => (
              <span key={`${tag}-${idx}`} className="rc-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Optional Footer Slot */}
      {footerAction && <div className="rc-card-footer">{footerAction}</div>}
    </article>
  );
}
