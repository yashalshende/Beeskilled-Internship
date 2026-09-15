import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BlogCard from './components/BlogCard';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import EmptyState from './components/EmptyState';
import PostModal from './components/PostModal';
import postsData from './data/posts.json';
import './App.css';

export default function App() {
  // ---------------------------------------------------------------------------
  // State: Search Query, Selected Category, Active Post Modal
  // ---------------------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePost, setActivePost] = useState(null);

  // ---------------------------------------------------------------------------
  // Categories extraction & counts
  // ---------------------------------------------------------------------------
  const categories = useMemo(() => {
    const unique = Array.from(new Set(postsData.map((p) => p.category)));
    return ['All', ...unique];
  }, []);

  const countsMap = useMemo(() => {
    const counts = { All: postsData.length };
    postsData.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // ---------------------------------------------------------------------------
  // Combined Search and Category Filtering Logic
  // ---------------------------------------------------------------------------
  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return postsData.filter((post) => {
      // 1. Category Matching
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;

      // 2. Search Matching (title, excerpt, content, tags, author)
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(query)));

      // Must satisfy both conditions simultaneously
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  // ---------------------------------------------------------------------------
  // Reset Handler (Clears both Search and Category filters)
  // ---------------------------------------------------------------------------
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div className="blog-app-root">
      {/* Site Header */}
      <Header totalCount={postsData.length} />

      <main className="blog-main-container">
        {/* Hero / Banner */}
        <section className="blog-hero">
          <div className="blog-hero-content">
            <span className="blog-hero-tag">Week 1 Mini Project • React Blog UI</span>
            <h2 className="blog-hero-title">Technical Articles &amp; Applied AI Guides</h2>
            <p className="blog-hero-desc">
              Explore hands-on deep dives in Full Stack MERN architecture, Explainable AI, RAG copilot systems, and CSS layout algorithms.
            </p>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="blog-controls-section" aria-label="Search and filter controls">
          {/* Search Bar */}
          <div className="controls-search-row">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearSearch={() => setSearchTerm('')}
              placeholder="Search by title, keywords, tags (e.g. 'RAG', 'React', 'FastAPI')..."
            />
          </div>

          {/* Category Pills & Results Counter */}
          <div className="controls-filter-row">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              countsMap={countsMap}
            />

            <div className="results-counter-box">
              <span className="results-counter-text">
                Showing <strong>{filteredPosts.length}</strong> of{' '}
                <strong>{postsData.length}</strong> posts
              </span>
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  type="button"
                  className="clear-all-link"
                  onClick={handleResetFilters}
                  aria-label="Clear all applied filters"
                >
                  Clear filters ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Post Grid / Empty State */}
        <section className="blog-posts-section" aria-label="Blog posts list">
          {filteredPosts.length > 0 ? (
            <div className="blog-grid">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onSelect={(p) => setActivePost(p)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              searchTerm={searchTerm}
              category={selectedCategory}
              onReset={handleResetFilters}
            />
          )}
        </section>
      </main>

      {/* Post Reading Modal */}
      <PostModal post={activePost} onClose={() => setActivePost(null)} />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
