import React from 'react';
import './Footer.css';
import Button from './Button';

/**
 * Reusable Footer Component
 *
 * Demonstrates:
 * - Props: brandTitle, tagline, sections, socialLinks, copyrightText, showBackToTop
 * - Events: smooth scroll back to top
 * - Dynamic rendering: columns and navigation links mapped dynamically
 *
 * @param {Object} props
 * @param {string} [props.brandTitle='Brand']
 * @param {string} [props.tagline]
 * @param {Array<{ title: string, links: Array<{ label: string, href: string }> }>} [props.sections=[]]
 * @param {Array<{ label: string, href: string, icon?: React.ReactNode }>} [props.socialLinks=[]]
 * @param {string} [props.copyrightText]
 * @param {boolean} [props.showBackToTop=true]
 */
export default function Footer({
  brandTitle = 'React Components Lab',
  tagline = 'Reusable UI component design system built for scalable React applications.',
  sections = [],
  socialLinks = [],
  copyrightText,
  showBackToTop = true,
}) {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="rc-footer">
      <div className="rc-footer-container">
        {/* Brand Information Column */}
        <div className="rc-footer-brand-col">
          <h3 className="rc-footer-brand-title">{brandTitle}</h3>
          {tagline && <p className="rc-footer-tagline">{tagline}</p>}

          {/* Social Links Dynamic Rendering */}
          {socialLinks.length > 0 && (
            <div className="rc-footer-socials">
              {socialLinks.map((item, idx) => (
                <a
                  key={`social-${idx}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rc-social-link"
                  aria-label={item.label}
                >
                  {item.icon || item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Navigation Sections Column */}
        {sections.map((section, sIdx) => (
          <div key={`section-${sIdx}`} className="rc-footer-col">
            <h4 className="rc-footer-col-title">{section.title}</h4>
            <ul className="rc-footer-links-list">
              {section.links.map((link, lIdx) => (
                <li key={`link-${sIdx}-${lIdx}`}>
                  <a href={link.href} className="rc-footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar with Copyright and Optional Back-to-Top Action */}
      <div className="rc-footer-bottom">
        <div className="rc-footer-bottom-container">
          <p className="rc-copyright">
            {copyrightText || `© ${currentYear} ${brandTitle}. All rights reserved.`}
          </p>

          {showBackToTop && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleScrollToTop}
              label="↑ Back to Top"
            />
          )}
        </div>
      </div>
    </footer>
  );
}
