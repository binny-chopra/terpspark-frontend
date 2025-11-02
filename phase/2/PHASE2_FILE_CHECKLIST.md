# TerpSpark Phase 2 - File Creation Checklist

## 📋 New Files to Create

### Mock Data
- [ ] `src/data/mockEvents.json` - Event data with 8 sample events, categories, and venues

### Services
- [ ] `src/services/eventService.js` - Event service layer for API calls

### Utilities
- [ ] `src/utils/eventUtils.js` - Event formatting and helper functions

### Components - Events
- [ ] `src/components/events/` - Create this new directory
- [ ] `src/components/events/EventCard.jsx` - Event card component
- [ ] `src/components/events/EventFilters.jsx` - Filter interface component
- [ ] `src/components/events/EventDetailModal.jsx` - Event detail modal

### Pages
- [ ] `src/pages/EventsPage.jsx` - Main events browse page

### Documentation
- [ ] `PHASE2_README.md` - Phase 2 documentation
- [ ] `PHASE2_FILE_CHECKLIST.md` - This checklist

---

## 📝 Files to Update

- [ ] `src/App.jsx` - Add EventsPage route
- [ ] `src/components/layout/Navigation.jsx` - Add routing functionality
- [ ] `src/pages/DashboardPage.jsx` - Add navigation to events

---

## 📊 File Count

**New Files**: 9
- Data: 1
- Services: 1  
- Utils: 1
- Components: 3
- Pages: 1
- Documentation: 2

**Updated Files**: 3

**Total Changes**: 12 files

---

## 🗂️ Directory Structure After Phase 2

```
src/
├── assets/                    (existing - empty)
├── components/
│   ├── common/               (existing from Phase 1)
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── events/               ⭐ NEW FOLDER
│   │   ├── EventCard.jsx         ⭐ NEW
│   │   ├── EventFilters.jsx      ⭐ NEW
│   │   └── EventDetailModal.jsx  ⭐ NEW
│   └── layout/               (existing from Phase 1)
│       ├── Header.jsx
│       └── Navigation.jsx        📝 UPDATED
├── context/                  (existing from Phase 1)
│   └── AuthContext.jsx
├── data/                     (existing from Phase 1)
│   ├── mockUsers.json
│   └── mockEvents.json           ⭐ NEW
├── pages/                    (existing from Phase 1)
│   ├── DashboardPage.jsx         📝 UPDATED
│   ├── LoginPage.jsx
│   └── EventsPage.jsx            ⭐ NEW
├── services/                 (existing from Phase 1)
│   ├── authService.js
│   └── eventService.js           ⭐ NEW
├── utils/                    (existing from Phase 1)
│   ├── constants.js
│   ├── storage.js
│   └── eventUtils.js             ⭐ NEW
├── App.jsx                       📝 UPDATED
├── main.jsx                  (existing - no changes)
└── index.css                 (existing - no changes)
```

---

## 🔧 Setup Instructions

### Step 1: Create New Directory

```bash
mkdir -p src/components/events
```

### Step 2: Create New Files

Create each file from the artifacts in the correct location:

**Data Files:**
```bash
# Create mockEvents.json in src/data/
touch src/data/mockEvents.json
```

**Service Files:**
```bash
# Create eventService.js in src/services/
touch src/services/eventService.js
```

**Utility Files:**
```bash
# Create eventUtils.js in src/utils/
touch src/utils/eventUtils.js
```

**Component Files:**
```bash
# Create event components
touch src/components/events/EventCard.jsx
touch src/components/events/EventFilters.jsx
touch src/components/events/EventDetailModal.jsx
```

**Page Files:**
```bash
# Create EventsPage
touch src/pages/EventsPage.jsx
```

### Step 3: Copy Content

Copy the content from each artifact into the corresponding file.

### Step 4: Update Existing Files

Update the following files with new content:
- `src/App.jsx`
- `src/components/layout/Navigation.jsx`
- `src/pages/DashboardPage.jsx`

### Step 5: Verify Installation

```bash
# Check that all files exist
ls -la src/data/
ls -la src/services/
ls -la src/utils/
ls -la src/components/events/
ls -la src/pages/

# Start the dev server
npm run dev
```

---

## ✅ Verification Checklist

After creating all files:

### File Existence
- [ ] mockEvents.json exists in src/data/
- [ ] eventService.js exists in src/services/
- [ ] eventUtils.js exists in src/utils/
- [ ] EventCard.jsx exists in src/components/events/
- [ ] EventFilters.jsx exists in src/components/events/
- [ ] EventDetailModal.jsx exists in src/components/events/
- [ ] EventsPage.jsx exists in src/pages/
- [ ] All updated files have new content

### Functionality Tests
- [ ] App compiles without errors
- [ ] Can navigate to /events route
- [ ] Events page loads with 8 sample events
- [ ] Can search events by keyword
- [ ] Can filter by category
- [ ] Can sort events
- [ ] Can click event to view details
- [ ] Event detail modal opens and closes
- [ ] Mobile responsive design works

### Code Quality
- [ ] No console errors
- [ ] No import errors
- [ ] All components render correctly
- [ ] Tailwind classes applied properly

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@components/events/EventCard'"

**Solution:**
- Verify the file exists at `src/components/events/EventCard.jsx`
- Check file name spelling (case-sensitive)
- Restart the dev server

### Issue: "mockEvents.json not found"

**Solution:**
- Ensure file is at `src/data/mockEvents.json`
- Verify JSON is valid (no trailing commas)
- Check file permissions

### Issue: Events page is blank

**Solution:**
- Check browser console for errors
- Verify mockEvents.json has valid JSON
- Ensure eventService.js is importing correctly

### Issue: Filters not working

**Solution:**
- Clear browser cache
- Verify eventService.js filter logic
- Check EventFilters component state management

---

## 📊 Integration Points

### Phase 1 ↔ Phase 2

**Uses from Phase 1:**
- Authentication context
- Header component
- Navigation component
- Protected route wrapper
- Loading spinner
- Constants and utilities

**Adds to Phase 1:**
- Event browsing capability
- Navigation routing
- Event data structure
- Event-specific utilities

---

## 🎯 Key Dependencies

Ensure these are already installed from Phase 1:
- react-router-dom (for navigation)
- lucide-react (for icons)
- tailwindcss (for styling)

No new dependencies required for Phase 2!

---

## 📝 Notes

- All event components are in the `src/components/events/` folder
- Event utilities are separate from general utilities
- Mock data includes 8 diverse events across all categories
- Registration functionality is placeholder for Phase 3

---

## 🚀 After Completion

Once all files are created and verified:

1. Test all features manually
2. Take screenshots for documentation
3. Share mockEvents.json structure with backend team
4. Prepare for Phase 3: Registration Flow

---

**Phase 2 File Setup Complete! ✨**