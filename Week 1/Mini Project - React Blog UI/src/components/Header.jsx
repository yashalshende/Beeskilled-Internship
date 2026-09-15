import React from 'react';
import './Header.css';

export default function Header({ totalCount = 0 }) {
  return (
    <header className="blog-header">
      <div className="blog-header-container">
        <div className="blog-header-brand">
          <span className="brand-logo-icon">📰</span>
          <div>
            <h1 className="brand-heading">TechPulse</h1>
            <span className="brand-sub">Engineering Insights &amp; Applied AI</span>
          </div>
        </div>

        <div className="blog-header-stats">
          <span className="stats-pill">
            <span className="stats-dot"></span>
            {totalCount} Articles Published
          </span>
          <a
            href="https://github.com/yashalshende/Beeskilled-Internship"
            target="_blank"
            rel="noopener noreferrer"
            className="repo-link-btn"
          >
            GitHub Repo ↗
          </a>
        </div>
      </div>
    </header>
  );
}
