# TerpSpark Phase 1 - File Creation Checklist

Use this checklist to ensure you've created all necessary files in the correct locations.

## 📋 Root Level Files

- [ ] `package.json`
- [ ] `vite.config.js`
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`
- [ ] `index.html`
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `SETUP_GUIDE.md`

## 📂 src/ Directory

- [ ] `src/main.jsx`
- [ ] `src/App.jsx`
- [ ] `src/index.css`

## 📂 src/components/common/

- [ ] `src/components/common/LoadingSpinner.jsx`
- [ ] `src/components/common/ProtectedRoute.jsx`

## 📂 src/components/layout/

- [ ] `src/components/layout/Header.jsx`
- [ ] `src/components/layout/Navigation.jsx`

## 📂 src/context/

- [ ] `src/context/AuthContext.jsx`

## 📂 src/data/

- [ ] `src/data/mockUsers.json`

## 📂 src/pages/

- [ ] `src/pages/LoginPage.jsx`
- [ ] `src/pages/DashboardPage.jsx`

## 📂 src/services/

- [ ] `src/services/authService.js`

## 📂 src/utils/

- [ ] `src/utils/constants.js`
- [ ] `src/utils/storage.js`

## 📂 src/assets/

- [ ] Create empty `src/assets/` folder (for future images/icons)

---

## 🔍 File Count Verification

**Total files to create: 22**

- Root level: 8 files
- src/ directory: 3 files
- components/common/: 2 files
- components/layout/: 2 files
- context/: 1 file
- data/: 1 file
- pages/: 2 files
- services/: 1 file
- utils/: 2 files

---

## 📥 Download Instructions

For each artifact provided, create the corresponding file:

### Example: Creating package.json

1. Create file: `package.json` in root directory
2. Copy content from the `package.json` artifact
3. Paste into the file
4. Save

### Example: Creating src/components/common/LoadingSpinner.jsx

1. Navigate to: `src/components/common/`
2. Create file: `LoadingSpinner.jsx`
3. Copy content from the `src/components/common/LoadingSpinner.jsx` artifact
4. Paste into the file
5. Save

---

## ✅ Verification Steps

After creating all files:

### 1. Check file structure
```bash
ls -R
```

Should show all files and folders in the correct hierarchy.

### 2. Check file count
```bash
find src -type f | wc -l
```

Should return: 14 (files in src/)

### 3. Check JSON validity
```bash
cat src/data/mockUsers.json | python -m json.tool
```

Should display formatted JSON without errors.

### 4. Try installation
```bash
npm install
```

Should complete without errors.

---

## 🚨 Common Mistakes to Avoid

1. ❌ **Wrong file extension**
   - Use `.jsx` for React components
   - Use `.js` for utilities and services
   - Use `.json` for data files

2. ❌ **Wrong directory**
   - Double-check each file's location
   - Case-sensitive folders (use lowercase)

3. ❌ **Missing folders**
   - Create all nested folders before adding files
   - Example: `mkdir -p src/components/common`

4. ❌ **Copy-paste errors**
   - Ensure complete content is copied
   - No extra characters at start/end
   - Proper indentation maintained

---

## 🎯 Quick Setup Commands

For faster setup, use these commands:

### Create all directories at once
```bash
mkdir -p src/{assets,components/{common,layout},context,data,pages,services,utils}
```

### Verify directory structure
```bash
tree src
```

Output should look like:
```
src
├── assets
├── components
│   ├── common
│   └── layout
├── context
├── data
├── pages
├── services
└── utils
```

---

## 📝 Manual Creation Order

Follow this order for easiest setup:

1. Create root configuration files (package.json, vite.config.js, etc.)
2. Run `npm install`
3. Create all src/ folders
4. Create utility files (constants.js, storage.js)
5. Create service files (authService.js)
6. Create context (AuthContext.jsx)
7. Create common components (LoadingSpinner, ProtectedRoute)
8. Create layout components (Header, Navigation)
9. Create page components (LoginPage, DashboardPage)
10. Create main app files (App.jsx, main.jsx, index.css)
11. Create mock data (mockUsers.json)

---

## ✨ Final Verification

Before running the app:

- [ ] All 22 files created
- [ ] All folders exist
- [ ] `npm install` completed successfully
- [ ] No typos in file names
- [ ] All imports use correct paths
- [ ] JSON files are valid

---

## 🚀 Ready to Launch!

Once all files are created and verified:

```bash
npm run dev
```

Visit: `http://localhost:3000`

Login with:
- Email: `student@umd.edu`
- Password: `student123`

---

**Happy Coding! 🎉**