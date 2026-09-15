# Mini Project: React Blog UI

**BeeSkilled Full Stack Web Development (MERN) Internship — Week 1**

---

## 📌 Project Overview
A technical blog user interface built using **React, Vite, and modern CSS Grid/Flexbox**.
Articles are loaded dynamically from `src/data/posts.json` and can be explored via **real-time keyword search** combined with **category filters**.

---

## 📋 Requirements & Features Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **JSON Post Data** | Loaded directly from `src/data/posts.json` (contains `id`, `title`, `category`, `author`, `date`, `readTime`, `image`, `excerpt`, `content`, `tags`). | ✅ PASS |
| **No Hardcoded Post Cards** | Zero static cards. All articles render dynamically using ES6 `.map()`. | ✅ PASS |
| **Dynamic Rendering via `map()`** | `filteredPosts.map(post => <BlogCard key={post.id} post={post} />)` | ✅ PASS |
| **Reusable Post Card Component** | `BlogCard.jsx` accepts full post object via props and renders badges, tags, metadata, and read actions. | ✅ PASS |
| **Real-time Search** | `SearchBar.jsx` allows case-insensitive keyword searching across title, excerpt, content, tags, and author. | ✅ PASS |
| **Category Filtering** | `CategoryFilter.jsx` pills render dynamically with post counts per category (`All`, `AI & Machine Learning`, `Frontend`, etc.). | ✅ PASS |
| **Combined Search & Filter** | Active category and search keyword filter simultaneously via React's `useMemo` hook. | ✅ PASS |
| **Empty State UI** | `EmptyState.jsx` renders a friendly contextual empty state when no posts match with a "Reset All Filters" action. | ✅ PASS |
| **Reading Modal** | `PostModal.jsx` opens full article view with keyboard Escape dismiss and backdrop click. | ✅ PASS |
| **Responsive Layout** | CSS Grid responsive layout: 3 columns on desktop, 2 columns on tablet, 1 column on mobile. | ✅ PASS |

---

## 🚀 How to Run

```bash
# Navigate to Mini Project directory
cd "Week 1/Mini Project - React Blog UI"

# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```
