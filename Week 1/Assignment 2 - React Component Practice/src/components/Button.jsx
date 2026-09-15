import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 *
 * Demonstrates:
 * - Props: variant, size, label, onClick, disabled, loading, icon, fullWidth, type, children
 * - Events: onClick handler triggered on button click
 * - State interaction: disables click when loading or disabled
 * - Dynamic rendering: renders icons and spinner conditionally
 *
 * @param {Object} props
 * @param {string} [props.label] - Button text label (or use children)
 * @param {Function} [props.onClick] - Click event handler callback
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.loading=false]
 * @param {React.ReactNode} [props.icon]
 * @param {boolean} [props.fullWidth=false]
 * @param {'button'|'submit'|'reset'} [props.type='button']
 * @param {React.ReactNode} [props.children]
 */
export default function Button({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const classNames = [
    'rc-button',
    `rc-btn-${variant}`,
    `rc-btn-${size}`,
    fullWidth ? 'rc-btn-full' : '',
    loading ? 'rc-btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className="rc-btn-spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {!loading && icon && <span className="rc-btn-icon">{icon}</span>}
      <span className="rc-btn-content">{children || label}</span>
    </button>
  );
}
