import React from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="blog-footer">
      <div className="blog-footer-container">
        <div>
          <h4 className="blog-footer-brand">TechPulse • BeeSkilled Week 1</h4>
          <p className="blog-footer-desc">
            A dynamic React blog UI demonstrating JSON data mapping, synchronized keyword searching, and category filtering.
          </p>
        </div>

        <div className="blog-footer-author">
          <p>Engineered by <strong>Yashal Sharadrao Shende</strong></p>
          <div className="author-links">
            <a href="https://github.com/yashalshende" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span>•</span>
            <a href="https://linkedin.com/in/yashal-shende-9072b22a5" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span>•</span>
            <a href="mailto:shendeyashal@gmail.com">Contact</a>
          </div>
        </div>
      </div>

      <div className="blog-footer-bottom">
        <p>© {currentYear} Yashal Shende. BeeSkilled Full Stack Web Development Internship.</p>
      </div>
    </footer>
  );
}
