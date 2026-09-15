# Assignment 2: React Component Practice

**BeeSkilled Full Stack Web Development (MERN) Internship — Week 1**

---

## 📌 Overview
This project delivers the **five reusable React components** specified by the Week 1 curriculum:
1. `Header`
2. `Footer`
3. `Card`
4. `Button`
5. `Form`

All components are isolated in `src/components/`, genuinely decoupled, and demonstrated through an interactive **Component Playground** where evaluators can test live props, state transitions, event dispatches, and dynamic rendering.

---

## 📋 Component Architecture & Checklist

| Required Component | Reusability & Features | Props | State | Events | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **`Header.jsx`** | Sticky/glass navigation bar, brand logo/subtitle, actions slot, responsive mobile hamburger drawer. | `brand`, `navItems`, `activeId`, `onNavSelect`, `actionsSlot`, `position`, `variant` | `isMobileOpen` | `onClick`, `onNavSelect`, resize / Escape key listener | ✅ PASS |
| **`Footer.jsx`** | Multi-column footer layout with dynamic navigation sections, social channels, copyright, and smooth back-to-top button. | `brandTitle`, `tagline`, `sections`, `socialLinks`, `copyrightText`, `showBackToTop` | Controlled | `onClick` (smooth scroll to top) | ✅ PASS |
| **`Card.jsx`** | Multi-variant card (`default`, `elevated`, `interactive`, `product`), optional media slot, dynamic badges, dynamic tags, footer action slot. | `variant`, `image`, `badge`, `badgeVariant`, `title`, `subtitle`, `tags`, `footerAction`, `onClick` | Controlled | `onClick`, `onKeyDown` (accessible keyboard controls) | ✅ PASS |
| **`Button.jsx`** | 6 variants (`primary`, `secondary`, `outline`, `ghost`, `danger`, `success`), 3 sizes, icon injection, accessible loading spinner, disabled state. | `label`, `onClick`, `variant`, `size`, `disabled`, `loading`, `icon`, `fullWidth`, `type`, `children` | Busy/Loading visual state | `onClick` (event propagation suppressed when disabled/loading) | ✅ PASS |
| **`Form.jsx`** | Fully controlled generic form engine generating text, email, select, textarea, and checkbox inputs dynamically from field schema props. | `title`, `description`, `fields`, `initialValues`, `onSubmit`, `submitLabel`, `resetOnSubmit` | `values`, `errors`, `touched`, `isSubmitting`, `statusBanner` | `onChange`, `onBlur`, `onSubmit` | ✅ PASS |

---

## 🚀 How to Run

```bash
# Navigate to Assignment 2 folder
cd "Week 1/Assignment 2 - React Component Practice"

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```
