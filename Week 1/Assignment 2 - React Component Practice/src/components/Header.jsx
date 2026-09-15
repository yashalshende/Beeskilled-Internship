import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

/**
 * Reusable Header Component
 *
 * Demonstrates:
 * - Props: brand, navItems, activeId, onNavSelect, actionsSlot, variant
 * - State: isMobileOpen (controls mobile responsive drawer)
 * - Events: onClick for navigation items, mobile toggle button, window resize/outside clicks
 * - Dynamic rendering: navItems rendered via .map()
 *
 * @param {Object} props
 * @param {{ title: string, logo?: React.ReactNode, subtitle?: string }} props.brand
 * @param {Array<{ id: string, label: string, href?: string, icon?: React.ReactNode }>} [props.navItems=[]]
 * @param {string} [props.activeId]
 * @param {Function} [props.onNavSelect]
 * @param {React.ReactNode} [props.actionsSlot]
 * @param {'sticky'|'fixed'|'static'} [props.position='sticky']
 * @param {'dark'|'glass'|'transparent'} [props.variant='glass']
 */
export default function Header({
  brand = { title: 'ReactApp' },
  navItems = [],
  activeId,
  onNavSelect,
  actionsSlot,
  position = 'sticky',
  variant = 'glass',
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headerRef = useRef(null);

  // Close mobile drawer when resizing beyond mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const handleNavClick = (item, e) => {
    if (item.href && !item.href.startsWith('#') && !onNavSelect) {
      // Normal external link
      return;
    }
    e.preventDefault();
    if (onNavSelect) {
      onNavSelect(item.id, item);
    }
    setIsMobileOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`rc-header rc-header-${position} rc-header-${variant}`}
    >
      <div className="rc-header-container">
        {/* Brand Logo & Title */}
        <div className="rc-header-brand">
          {brand.logo && <span className="rc-brand-logo">{brand.logo}</span>}
          <div>
            <span className="rc-brand-title">{brand.title}</span>
            {brand.subtitle && <span className="rc-brand-subtitle">{brand.subtitle}</span>}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="rc-desktop-nav" aria-label="Main Navigation">
          <ul className="rc-nav-list">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id} className="rc-nav-item">
                  <a
                    href={item.href || `#${item.id}`}
                    className={`rc-nav-link ${isActive ? 'rc-nav-active' : ''}`}
                    onClick={(e) => handleNavClick(item, e)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.icon && <span className="rc-nav-icon">{item.icon}</span>}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Header Action Slot (e.g. CTA buttons, search, theme switch) */}
        <div className="rc-header-right">
          {actionsSlot && <div className="rc-header-actions">{actionsSlot}</div>}

          {/* Mobile Hamburger Toggle Button */}
          {navItems.length > 0 && (
            <button
              type="button"
              className={`rc-hamburger-btn ${isMobileOpen ? 'rc-hamburger-open' : ''}`}
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileOpen}
            >
              <span className="rc-hamburger-line"></span>
              <span className="rc-hamburger-line"></span>
              <span className="rc-hamburger-line"></span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileOpen && (
        <nav className="rc-mobile-drawer" aria-label="Mobile Navigation">
          <ul className="rc-mobile-nav-list">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={`mobile-${item.id}`}>
                  <a
                    href={item.href || `#${item.id}`}
                    className={`rc-mobile-nav-link ${isActive ? 'rc-mobile-active' : ''}`}
                    onClick={(e) => handleNavClick(item, e)}
                  >
                    {item.icon && <span className="rc-nav-icon">{item.icon}</span>}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          {actionsSlot && <div className="rc-mobile-actions">{actionsSlot}</div>}
        </nav>
      )}
    </header>
  );
}
