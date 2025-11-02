# TerpSpark Phase 1 - Complete Setup Guide

## 📦 Project Structure Overview

After downloading, your project should have this structure:

```
terpspark-frontend/
├── src/
│   ├── assets/                    # (Create this empty folder)
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       └── Navigation.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   └── mockUsers.json
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   └── LoginPage.jsx
│   ├── services/
│   │   └── authService.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── storage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🔧 Step-by-Step Setup Instructions

### Step 1: Create Project Directory

```bash
mkdir terpspark-frontend
cd terpspark-frontend
```

### Step 2: Create All Required Files

Create each file from the artifacts provided and place them in the correct directory according to the structure above.

**Important folders to create:**
```bash
mkdir -p src/assets
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/context
mkdir -p src/data
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/utils
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- react & react-dom (v18.2.0)
- react-router-dom (v6.20.0)
- lucide-react (v0.263.1)
- vite & @vitejs/plugin-react
- tailwindcss, autoprefixer, postcss

### Step 4: Verify Installation

Check that all dependencies are installed:
```bash
npm list --depth=0
```

### Step 5: Start Development Server

```bash
npm run dev
```

You should see output like:
```
VITE v5.0.8  ready in 300 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 6: Open in Browser

Navigate to `http://localhost:3000` in your browser.

---

## 🧪 Testing the Application

### 1. Test Login Functionality

Try logging in with each role:

**Student Account:**
- Email: `student@umd.edu`
- Password: `student123`
- Should see: Student dashboard with 3 navigation items

**Organizer Account:**
- Email: `organizer@umd.edu`
- Password: `organizer123`
- Should see: Organizer dashboard with 4 navigation items

**Admin Account:**
- Email: `admin@umd.edu`
- Password: `admin123`
- Should see: Admin dashboard with 5 navigation items

### 2. Test Navigation

- Click on different navigation tabs
- Active tab should be highlighted in red
- Navigation should persist the selected state

### 3. Test Mobile Responsiveness

- Resize browser window to mobile size (< 768px)
- Header should show hamburger menu
- Clicking hamburger should show mobile menu
- All functionality should work on mobile

### 4. Test Session Persistence

- Login with any account
- Refresh the page (F5 or Cmd+R)
- You should remain logged in
- Click "Logout"
- You should be redirected to login page

### 5. Test Protected Routes

- Log out
- Try to navigate to `http://localhost:3000/dashboard`
- You should be redirected to login page

---

## 🚨 Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 3000 is already in use

**Solution:**
```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port in vite.config.js
```

### Issue: Vite can't resolve path aliases

**Solution:**
Make sure `vite.config.js` is at the root of your project and contains the path aliases configuration.

### Issue: Tailwind styles not applying

**Solution:**
1. Verify `tailwind.config.js` and `postcss.config.js` exist
2. Check that `index.css` contains `@tailwind` directives
3. Restart the dev server: `npm run dev`

### Issue: Module not found errors

**Solution:**
Check that all files are in the correct directories according to the project structure. Pay attention to:
- File names (case-sensitive)
- File extensions (.jsx for React components)
- Import paths

---

## 🎯 Key Features to Verify

### Authentication Flow
- ✅ Login page displays correctly
- ✅ Invalid credentials show error message
- ✅ Valid credentials redirect to dashboard
- ✅ Session persists on page refresh
- ✅ Logout clears session and redirects to login

### Role-Based Access
- ✅ Different users see different navigation items
- ✅ Dashboard content changes based on role
- ✅ Role badge displays correctly in header

### UI/UX
- ✅ Loading spinner shows during authentication
- ✅ Error messages are user-friendly
- ✅ Buttons have hover effects
- ✅ Forms are keyboard accessible (Tab navigation, Enter to submit)
- ✅ Mobile menu works on small screens

---

## 📝 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and reinstall
rm -rf node_modules package-lock.json && npm install
```

---

## 🔍 Code Quality Checks

Before committing code:

1. **Check for console errors**: Open browser DevTools (F12) and check console
2. **Test all user flows**: Login, navigation, logout
3. **Verify responsive design**: Test on different screen sizes
4. **Check accessibility**: Ensure keyboard navigation works
5. **Review code**: Look for any hardcoded values or TODOs

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

### Browser DevTools
- **Chrome**: F12 or Cmd+Opt+I (Mac)
- **Firefox**: F12 or Cmd+Opt+I (Mac)
- **Safari**: Cmd+Opt+I (enable in Preferences > Advanced)

---

## 🤝 Contributing

When adding new features:

1. Create new files in appropriate directories
2. Follow the existing naming conventions
3. Import from path aliases (@components, @utils, etc.)
4. Update this documentation if needed

---

## ✅ Phase 1 Completion Checklist

- [ ] All dependencies installed successfully
- [ ] Development server starts without errors
- [ ] Can login with all three user roles
- [ ] Navigation works correctly
- [ ] Dashboard displays role-specific content
- [ ] Session persists on page refresh
- [ ] Logout functionality works
- [ ] Mobile responsive design works
- [ ] No console errors in browser DevTools

---

## 🎉 Next Steps

Once Phase 1 is working perfectly:

1. Take screenshots of each role's dashboard
2. Document any issues or bugs found
3. Share mock data structure with backend team
4. Prepare for Phase 2: Event Discovery & Browse

---

**Need Help?**

Contact the development team or refer to the main README.md for more information.