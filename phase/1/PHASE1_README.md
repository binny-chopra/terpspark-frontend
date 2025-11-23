# TerpSpark Phase 1 - Frontend Application

A fully modular, production-ready React application with authentication, role-based access control, and responsive design.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Testing](#-testing-the-application)
- [Troubleshooting](#-troubleshooting)
- [File Creation Checklist](#-file-creation-checklist)
- [Backend Integration](#-backend-integration)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

TerpSpark Phase 1 is a React-based frontend application featuring SSO-style authentication, three user roles (Student, Organizer, Admin), and a modern, responsive UI built with Vite, React Router, and Tailwind CSS.

### Key Capabilities

- **Authentication System** - SSO-style login with session persistence
- **Role-Based Access Control** - Three distinct user roles with specific permissions
- **Responsive Design** - Mobile-friendly interface with adaptive layouts
- **Modern Architecture** - Path aliases, separation of concerns, and reusable components

---

## ✨ Features

### Authentication (FR-1)
- SSO-style login interface
- Session persistence across page refreshes
- Protected routes with automatic redirects
- Secure logout functionality

### Role-Based Access Control
- **Student Role**: Browse events, view profile
- **Organizer Role**: Create events, manage registrations, view analytics
- **Admin Role**: User management, system settings, comprehensive reports

### UI/UX
- Responsive header with hamburger menu on mobile
- Role-specific navigation with active tab highlighting
- Visual role badges
- Loading states and error handling
- Keyboard accessible forms

---

## 🛠 Tech Stack

- **React** 18.2.0 - UI framework
- **React Router DOM** 6.20.0 - Client-side routing
- **Vite** 5.0.8 - Build tool and dev server
- **Tailwind CSS** 3.3.6 - Utility-first CSS framework
- **Lucide React** 0.263.1 - Icon library

---

## 📦 Project Structure

```
terpspark-frontend/
├── src/
│   ├── assets/                    # Images and static files
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       └── Navigation.jsx
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication state management
│   ├── data/
│   │   └── mockUsers.json         # Mock user data
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   └── LoginPage.jsx
│   ├── services/
│   │   └── authService.js         # Authentication logic
│   ├── utils/
│   │   ├── constants.js           # App constants
│   │   └── storage.js             # localStorage utilities
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── .gitignore
├── index.html                     # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. **Create project directory**
   ```bash
   mkdir terpspark-frontend
   cd terpspark-frontend
   ```

2. **Create all required folders**
   ```bash
   mkdir -p src/{assets,components/{common,layout},context,data,pages,services,utils}
   ```

3. **Copy all project files** into their respective locations according to the project structure above

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to `http://localhost:3000`

### Test Credentials

Login with any of these accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | student@umd.edu | student123 |
| Organizer | organizer@umd.edu | organizer123 |
| Admin | admin@umd.edu | admin123 |

---

## 🧪 Testing the Application

### 1. Authentication Flow
- ✅ Login page displays correctly
- ✅ Invalid credentials show error message
- ✅ Valid credentials redirect to dashboard
- ✅ Session persists on page refresh
- ✅ Logout clears session and redirects to login

### 2. Role-Based Features

**Student Dashboard**
- Browse Events
- My Events
- Profile

**Organizer Dashboard**
- Browse Events
- My Events
- Create Event
- Analytics

**Admin Dashboard**
- Browse Events
- My Events
- Manage Users
- System Settings
- Reports

### 3. Responsive Design
- Resize browser to mobile size (< 768px)
- Hamburger menu should appear
- All features should remain accessible
- Mobile menu should toggle correctly

### 4. Navigation
- Click different navigation tabs
- Active tab highlights in red
- Navigation state persists

### 5. Protected Routes
- Log out
- Try accessing `/dashboard` directly
- Should redirect to login page

---

## 🚨 Troubleshooting

### `npm install` fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Port 3000 already in use

```bash
# Mac/Linux - Kill process on port 3000
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Vite can't resolve path aliases

Verify `vite.config.js` exists at project root with correct path alias configuration.

### Tailwind styles not applying

1. Verify `tailwind.config.js` and `postcss.config.js` exist
2. Check `index.css` contains `@tailwind` directives
3. Restart dev server: `npm run dev`

### Module not found errors

Verify file locations match the project structure. Check:
- File names (case-sensitive)
- File extensions (.jsx for React components)
- Import paths in code

---

## 📋 File Creation Checklist

### Root Level (8 files)
- [ ] `package.json`
- [ ] `vite.config.js`
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`
- [ ] `index.html`
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `SETUP_GUIDE.md`

### src/ Directory (3 files)
- [ ] `src/main.jsx`
- [ ] `src/App.jsx`
- [ ] `src/index.css`

### Components (4 files)
- [ ] `src/components/common/LoadingSpinner.jsx`
- [ ] `src/components/common/ProtectedRoute.jsx`
- [ ] `src/components/layout/Header.jsx`
- [ ] `src/components/layout/Navigation.jsx`

### Other Directories (7 files)
- [ ] `src/context/AuthContext.jsx`
- [ ] `src/data/mockUsers.json`
- [ ] `src/pages/LoginPage.jsx`
- [ ] `src/pages/DashboardPage.jsx`
- [ ] `src/services/authService.js`
- [ ] `src/utils/constants.js`
- [ ] `src/utils/storage.js`

### Folders
- [ ] `src/assets/` (empty folder for future assets)

**Total: 22 files + 1 folder**

### Verification Commands

```bash
# Check file structure
ls -R

# Count files in src/
find src -type f | wc -l
# Should return: 14

# Validate JSON
cat src/data/mockUsers.json | python -m json.tool

# Verify directory structure
tree src
```

---

## 🔗 Backend Integration

### API Endpoints Required

Share the `src/data/mockUsers.json` structure with backend team to prepare these endpoints:

```
POST   /api/auth/login      - User authentication
POST   /api/auth/logout     - User logout
GET    /api/auth/validate   - Validate session token
GET    /api/auth/user       - Get current user data
```

### Mock User Data Structure

```json
{
  "email": "student@umd.edu",
  "password": "student123",
  "id": "1",
  "name": "John Doe",
  "role": "student"
}
```

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

## 🤝 Contributing

### When Adding New Features

1. Create files in appropriate directories
2. Follow existing naming conventions
3. Use path aliases (@components, @utils, @services, etc.)
4. Update documentation as needed
5. Test on mobile and desktop

### Code Quality Checklist

- [ ] No console errors in browser DevTools
- [ ] All user flows tested (login, navigation, logout)
- [ ] Responsive design verified on different screen sizes
- [ ] Keyboard navigation works correctly
- [ ] Code follows existing patterns and style

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

---

## ✅ Phase 1 Completion Checklist

- [ ] All 22 files created in correct locations
- [ ] Dependencies installed successfully
- [ ] Development server starts without errors
- [ ] Can login with all three user roles
- [ ] Navigation works for all roles
- [ ] Dashboard displays role-specific content
- [ ] Session persists on page refresh
- [ ] Logout functionality works
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Protected routes redirect correctly