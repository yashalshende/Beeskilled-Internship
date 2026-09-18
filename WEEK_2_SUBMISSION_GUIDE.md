# BeeSkilled Internship — Week 2 Submission Guide
## Step-by-Step Google Drive Upload & Portal Submission Instructions

This guide provides everything you need to upload your Week 2 backend submission to Google Drive and submit it to the **BeeSkilled Internship Portal**.

---

## 📦 1. Pre-Packaged Submission ZIP Archive

A clean, production-ready submission archive has been created for you:

- **Desktop File:** `C:\Users\shend\OneDrive\Desktop\Yashal_Shende_BeeSkilled_Week2_Submission.zip`
- **Project Folder File:** `c:\Users\shend\OneDrive\Desktop\Beeskilled\Yashal_Shende_BeeSkilled_Week2_Submission.zip`

### What is inside the ZIP file:
- `Week 2/` — Complete Express.js + MongoDB backend code, MVC architecture, routes, controllers, middleware, and tests.
- `Week 2/SUBMISSION_DOCUMENTATION.md` — Formal submission documentation with endpoint tables, security architecture, and test scores.
- `Week 2/test_evidence_visual_suite.png` — Screenshot proof of the 100% test pass score.
- `postman/` — Postman Collection & Environment JSON files ready for instant import.
- `README.md` — Repository roadmap & architecture guide.
- **Excluded:** `node_modules` and raw `.env` secrets have been excluded to keep the zip ultra-lightweight (< 500 KB) and secure.

---

## ☁️ 2. How to Upload to Google Drive

1. Open your web browser and go to: **[https://drive.google.com](https://drive.google.com)**
2. Log in with your preferred Google Account (e.g., `shendeyashal@gmail.com`).
3. Create a dedicated folder (optional but recommended):
   - Click **+ New** > **New folder**
   - Name it: `BeeSkilled MERN Internship - Week 2`
   - Open that folder.
4. **Drag & Drop** the file:
   - Drag `Yashal_Shende_BeeSkilled_Week2_Submission.zip` from your Desktop into the Google Drive window.
5. Wait a few seconds for the upload to complete (it uploads in under 5 seconds).

---

## 🔓 3. Setting Permissions (CRUCIAL STEP)

> ⚠️ **IMPORTANT: Do NOT leave the file as "Restricted"**, or the BeeSkilled evaluator will not be able to download or inspect your submission!

1. Right-click on `Yashal_Shende_BeeSkilled_Week2_Submission.zip` in Google Drive.
2. Click **Share** > **Share**.
3. Under the **General access** section, change **Restricted** to:  
   👉 **"Anyone with the link"**
4. Ensure the role on the right says **"Viewer"**.
5. Click **"Copy link"** (this copies the link to your clipboard).
6. Click **Done**.

---

## 📝 4. Ready-to-Copy Text for the BeeSkilled Portal

When submitting on the BeeSkilled portal, copy and paste the template below (replace `[PASTE_YOUR_COPIED_GOOGLE_DRIVE_LINK_HERE]` with the link you copied in Step 3):

```markdown
Candidate Name: Yashal Sharadrao Shende
Degree: MCA, Ramdeobaba University, Nagpur
Internship: BeeSkilled Full Stack Web Development (MERN)
Week: Week 2 - Backend Fundamentals, REST APIs, MongoDB & Authentication

Google Drive Submission Link:
[PASTE_YOUR_COPIED_GOOGLE_DRIVE_LINK_HERE]

GitHub Repository:
https://github.com/yashalshende/Beeskilled-Internship

Week 2 Submission Highlights & Results:
• Architecture: Node.js (v24), Express.js, MongoDB, Mongoose, JWT & bcrypt.
• Assignment 1 (To-Do List API): Full CRUD endpoints, input validation, 24-character ObjectId verification, pagination & filtering.
• Assignment 2 (User Authentication API): Secure registration, duplicate email rejection, bcrypt hashing (10 salt rounds), login authentication with constant-time comparison (timing attack defense), and RFC 7519 JWT verification.
• Mini Project (Notes Backend): User-scoped notes with User references, compound indexing, full CRUD, and strict cross-user authorization barriers (HTTP 403 Forbidden).
• Automated Test Suites: 175 / 175 assertions passed across 4 test suites (100% pass rate).
• Newman / Postman Collection: 14 / 14 requests passed, 30 / 30 assertions passed, 0 failures.
• Live QA Evaluator: 39 / 39 criteria passed (Compliance Score: 100 / 100).
• Visual Test Runner: 16 / 16 visual tests passed (100% score) on interactive browser harness.
```

---

## 🔍 5. Verification Checklist Before Submitting

- [x] All 175 automated assertions pass (`npm test`)
- [x] Live QA Evaluator achieves 100/100 score (`npm run test:qa`)
- [x] Newman Postman tests pass with 0 failures (`npm run test:postman`)
- [x] Visual test runner passes with 100% score (`visual_test.html`)
- [x] `node_modules` and `.env` are safely excluded from the zip
- [ ] Google Drive link permission is set to "Anyone with the link"
- [ ] Link opens successfully in an incognito / private browser window
- [ ] Submitted to the BeeSkilled portal
