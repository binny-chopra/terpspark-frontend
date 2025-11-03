# TerpSpark Phase 4 - File Creation Checklist

## 📋 New Files to Create

### Services
- [ ] `src/services/organizerService.js` - Organizer event management service

### Components - Organizer
- [ ] `src/components/organizer/` - Create this new directory
- [ ] `src/components/organizer/OrganizerEventCard.jsx` - Event card for organizers

### Pages
- [ ] `src/pages/CreateEventPage.jsx` - Event creation form
- [ ] `src/pages/MyEventsPage.jsx` - Organizer events dashboard
- [ ] `src/pages/EventAttendeesPage.jsx` - Attendee management page

### Documentation
- [ ] `PHASE4_README.md` - Phase 4 documentation
- [ ] `PHASE4_FILE_CHECKLIST.md` - This checklist

---

## 📝 Files to Update

- [ ] `src/App.jsx` - Add organizer routes
- [ ] `src/utils/constants.js` - Add new route constants

---

## 📊 File Count

**New Files**: 7
- Services: 1
- Components: 1
- Pages: 3
- Documentation: 2

**Updated Files**: 2

**Total Changes**: 9 files

---

## 🗂️ Directory Structure After Phase 4

```
src/
├── assets/                    (existing - empty)
├── components/
│   ├── common/               (Phase 1)
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── events/               (Phase 2)
│   │   ├── EventCard.jsx
│   │   ├── EventFilters.jsx
│   │   └── EventDetailModal.jsx
│   ├── layout/               (Phase 1)
│   │   ├── Header.jsx
│   │   └── Navigation.jsx
│   ├── organizer/            ⭐ NEW FOLDER
│   │   └── OrganizerEventCard.jsx     ⭐ NEW
│   └── registration/         (Phase 3)
│       ├── RegistrationModal.jsx
│       ├── RegistrationCard.jsx
│       ├── WaitlistCard.jsx
│       └── TicketModal.jsx
├── context/                  (Phase 1)
│   └── AuthContext.jsx
├── data/                     (Phases 1-3)
│   ├── mockUsers.json
│   ├── mockEvents.json
│   └── mockRegistrations.json
├── pages/                    (Phases 1-4)
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   ├── EventsPage.jsx
│   ├── MyRegistrationsPage.jsx
│   ├── MyEventsPage.jsx               ⭐ NEW
│   ├── CreateEventPage.jsx            ⭐ NEW
│   └── EventAttendeesPage.jsx         ⭐ NEW
├── services/                 (Phases 1-4)
│   ├── authService.js
│   ├── eventService.js
│   ├── registrationService.js
│   └── organizerService.js            ⭐ NEW
├── utils/                    (Phases 1-2)
│   ├── constants.js                   📝 UPDATED
│   ├── storage.js
│   └── eventUtils.js
├── App.jsx                            📝 UPDATED
├── main.jsx                  (existing - no changes)
└── index.css                 (existing - no changes)
```

---

## 🔧 Setup Instructions

### Step 1: Create New Directory

```bash
mkdir -p src/components/organizer
```

### Step 2: Create New Files

**Service Files:**
```bash
touch src/services/organizerService.js
```

**Component Files:**
```bash
touch src/components/organizer/OrganizerEventCard.jsx
```

**Page Files:**
```bash
touch src/pages/CreateEventPage.jsx
touch src/pages/MyEventsPage.jsx
touch src/pages/EventAttendeesPage.jsx
```

### Step 3: Copy Content

Copy the content from each artifact into the corresponding file.

### Step 4: Update Existing Files

Update these files with new content:
- `src/App.jsx` (add organizer routes)
- `src/utils/constants.js` (add new routes)

### Step 5: Verify Installation

```bash
# Check that all files exist
ls -la src/services/
ls -la src/components/organizer/
ls -la src/pages/

# Start the dev server
npm run dev
```

---

## ✅ Verification Checklist

### File Existence
- [ ] organizerService.js exists in src/services/
- [ ] OrganizerEventCard.jsx exists in src/components/organizer/
- [ ] CreateEventPage.jsx exists in src/pages/
- [ ] MyEventsPage.jsx exists in src/pages/
- [ ] EventAttendeesPage.jsx exists in src/pages/
- [ ] App.jsx has been updated with new routes
- [ ] constants.js has been updated

### Functionality Tests

#### Login & Navigation
- [ ] Can login as organizer
- [ ] Navigation shows "My Events" and "Create Event"
- [ ] Can navigate to My Events
- [ ] Can navigate to Create Event

#### Event Creation
- [ ] Create Event page loads
- [ ] Form shows all fields
- [ ] Categories populate from data
- [ ] Form validation works
- [ ] Can submit event
- [ ] Event appears in My Events

#### My Events Dashboard
- [ ] Page loads without errors
- [ ] Stats cards show counts
- [ ] Can switch between tabs
- [ ] Events display correctly
- [ ] Three-dot menu works
- [ ] Can duplicate event

#### Event Management
- [ ] Can click three dots menu
- [ ] Menu shows correct actions based on status
- [ ] Duplicate creates copy
- [ ] Cancel works (with confirmation)
- [ ] Can view attendees (for published events)

#### Attendees Page
- [ ] Page loads for organizer's event
- [ ] Stats cards display
- [ ] Mock attendees show
- [ ] Search works
- [ ] Export CSV works (downloads file)
- [ ] Send announcement modal opens

### Mobile Responsiveness
- [ ] Create Event form responsive
- [ ] My Events page responsive
- [ ] Event cards responsive
- [ ] Attendees table scrollable on mobile
- [ ] Navigation works on mobile

### Code Quality
- [ ] No console errors
- [ ] No import errors
- [ ] All routes work
- [ ] Protected routes enforce roles
- [ ] Forms validate properly

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@components/organizer/OrganizerEventCard'"

**Solution:**
- Verify folder exists: `src/components/organizer/`
- Check file name spelling (case-sensitive)
- Restart dev server

### Issue: Create Event page shows 404

**Solution:**
- Check App.jsx has the route
- Verify import path is correct
- Check ProtectedRoute allowedRoles includes ORGANIZER

### Issue: Categories dropdown is empty

**Solution:**
- Verify mockEvents.json has categories array
- Check getCategories() function in eventService.js
- Check console for errors

### Issue: Can't see created events

**Solution:**
- Check localStorage key: `terpspark_organizer_events`
- Verify user ID matches organizer ID
- Check filter tabs (event might be in "Pending")

### Issue: Attendees page shows empty

**Solution:**
- Mock data is intentional for demo
- Real attendees will come from backend
- Check eventId parameter is being passed

---

## 📊 Integration Points

### Phase 1 → Phase 4

**Uses from Phase 1:**
- Authentication context
- User roles
- Protected routes
- Navigation system

### Phase 2 → Phase 4

**Uses from Phase 2:**
- Event utilities
- Category colors
- Event formatting functions

### Phase 3 → Phase 4

**Uses from Phase 3:**
- Registration data structure
- Capacity calculations
- Status tracking

---

## 🎯 Key Dependencies

From Previous Phases (Already Installed):
- react-router-dom (routing with params)
- lucide-react (icons)
- tailwindcss (styling)

**No new dependencies required!**

---

## 📝 Data Flow

### Event Creation Flow

```
1. Organizer fills form
2. Validation runs
3. Submit creates event
4. Event saved to localStorage
5. Event appears in My Events (Pending)
6. Admin approval needed (Phase 5)
```

### Event Management Flow

```
1. Organizer views My Events
2. Clicks three-dot menu
3. Selects action (Edit/Duplicate/Cancel)
4. Action executes
5. Event updates in storage
6. UI refreshes
```

### Attendees Flow

```
1. Organizer clicks View Attendees
2. eventId passed to page
3. Service fetches attendees
4. Display in table
5. Search/export/announce available
```

---

## 🚀 After Completion

Once all files are created and verified:

1. **Test All Flows**: Create, view, manage, attendees
2. **Test as Different Roles**: Organizer vs Student
3. **Test Mobile**: All pages responsive
4. **Take Screenshots**: For documentation
5. **Share With Backend**: API contracts and data models

---

## 💡 Quick Test Script

```bash
# 1. Login as Organizer
Email: organizer@umd.edu
Password: organizer123

# 2. Navigate to My Events
# Should see existing events from mock data

# 3. Create New Event
Click "Create Event"
Fill all required fields
Submit

# 4. View in My Events
Event should appear in "Pending" tab

# 5. Test Duplicate
Click three dots → Duplicate
New draft created

# 6. View Attendees
Find published event (from mock data)
Click three dots → View Attendees
See mock attendee list

# 7. Test Search
Type in search box
Attendees filter

# 8. Export CSV
Click "Export CSV"
File downloads

# 9. Send Announcement
Click "Send Announcement"
Modal opens
Type message
Submit (shows success)
```

---

## ✅ Phase 4 Completion Checklist

- [ ] All 7 new files created
- [ ] All 2 files updated
- [ ] Can login as organizer
- [ ] Create Event page works
- [ ] Form validation works
- [ ] My Events dashboard loads
- [ ] Can view by status tabs
- [ ] Can duplicate events
- [ ] Can view attendees
- [ ] Can export CSV
- [ ] Can send announcements
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Documentation complete

---

**Phase 4 File Setup Complete! ✨**

Ready to test organizer event management features!