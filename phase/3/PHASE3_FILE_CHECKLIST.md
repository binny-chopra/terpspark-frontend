# TerpSpark Phase 3 - File Creation Checklist

## 📋 New Files to Create

### Mock Data
- [ ] `src/data/mockRegistrations.json` - Registration and waitlist mock data

### Services
- [ ] `src/services/registrationService.js` - Registration management service

### Components - Registration
- [ ] `src/components/registration/` - Create this new directory
- [ ] `src/components/registration/RegistrationModal.jsx` - Registration form with guests
- [ ] `src/components/registration/RegistrationCard.jsx` - Display user's registrations
- [ ] `src/components/registration/WaitlistCard.jsx` - Display waitlist entries
- [ ] `src/components/registration/TicketModal.jsx` - QR code ticket viewer

### Pages
- [ ] `src/pages/MyRegistrationsPage.jsx` - Registrations management page

### Documentation
- [ ] `PHASE3_README.md` - Phase 3 documentation
- [ ] `PHASE3_FILE_CHECKLIST.md` - This checklist

---

## 📝 Files to Update

- [ ] `src/pages/EventsPage.jsx` - Add registration functionality
- [ ] `src/App.jsx` - Add My Registrations route

---

## 📊 File Count

**New Files**: 9
- Data: 1
- Services: 1
- Components: 4
- Pages: 1
- Documentation: 2

**Updated Files**: 2

**Total Changes**: 11 files

---

## 🗂️ Directory Structure After Phase 3

```
src/
├── assets/                    (existing - empty)
├── components/
│   ├── common/               (existing from Phase 1)
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── events/               (existing from Phase 2)
│   │   ├── EventCard.jsx
│   │   ├── EventFilters.jsx
│   │   └── EventDetailModal.jsx
│   ├── layout/               (existing from Phase 1)
│   │   ├── Header.jsx
│   │   └── Navigation.jsx
│   └── registration/         ⭐ NEW FOLDER
│       ├── RegistrationModal.jsx      ⭐ NEW
│       ├── RegistrationCard.jsx       ⭐ NEW
│       ├── WaitlistCard.jsx           ⭐ NEW
│       └── TicketModal.jsx            ⭐ NEW
├── context/                  (existing from Phase 1)
│   └── AuthContext.jsx
├── data/                     (existing from Phase 1/2)
│   ├── mockUsers.json
│   ├── mockEvents.json
│   └── mockRegistrations.json        ⭐ NEW
├── pages/                    (existing from Phase 1/2)
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   ├── EventsPage.jsx               📝 UPDATED
│   └── MyRegistrationsPage.jsx       ⭐ NEW
├── services/                 (existing from Phase 1/2)
│   ├── authService.js
│   ├── eventService.js
│   └── registrationService.js        ⭐ NEW
├── utils/                    (existing from Phase 1/2)
│   ├── constants.js
│   ├── storage.js
│   └── eventUtils.js
├── App.jsx                           📝 UPDATED
├── main.jsx                  (existing - no changes)
└── index.css                 (existing - no changes)
```

---

## 🔧 Setup Instructions

### Step 1: Create New Directory

```bash
mkdir -p src/components/registration
```

### Step 2: Create New Files

**Data Files:**
```bash
touch src/data/mockRegistrations.json
```

**Service Files:**
```bash
touch src/services/registrationService.js
```

**Component Files:**
```bash
touch src/components/registration/RegistrationModal.jsx
touch src/components/registration/RegistrationCard.jsx
touch src/components/registration/WaitlistCard.jsx
touch src/components/registration/TicketModal.jsx
```

**Page Files:**
```bash
touch src/pages/MyRegistrationsPage.jsx
```

### Step 3: Copy Content

Copy the content from each artifact into the corresponding file.

### Step 4: Update Existing Files

Update these files with new content:
- `src/pages/EventsPage.jsx`
- `src/App.jsx`

### Step 5: Verify Installation

```bash
# Check that all files exist
ls -la src/data/
ls -la src/services/
ls -la src/components/registration/
ls -la src/pages/

# Start the dev server
npm run dev
```

---

## ✅ Verification Checklist

### File Existence
- [ ] mockRegistrations.json exists in src/data/
- [ ] registrationService.js exists in src/services/
- [ ] RegistrationModal.jsx exists in src/components/registration/
- [ ] RegistrationCard.jsx exists in src/components/registration/
- [ ] WaitlistCard.jsx exists in src/components/registration/
- [ ] TicketModal.jsx exists in src/components/registration/
- [ ] MyRegistrationsPage.jsx exists in src/pages/
- [ ] EventsPage.jsx has been updated
- [ ] App.jsx has been updated

### Functionality Tests

#### Registration Flow
- [ ] Can open event detail modal
- [ ] Can click "Register for Event"
- [ ] Registration modal opens
- [ ] Can add guests (name and email)
- [ ] Can select notification preference
- [ ] Can submit registration
- [ ] See success message
- [ ] Event capacity updates

#### Guest Management
- [ ] Can add guest with UMD email
- [ ] Cannot add guest without @umd.edu
- [ ] Cannot add more than 2 guests
- [ ] Can remove guest before submitting
- [ ] Guests show in registration card

#### Waitlist Flow
- [ ] Full event shows "Join Waitlist"
- [ ] Can join waitlist
- [ ] See position number
- [ ] Waitlist appears in My Registrations
- [ ] Can leave waitlist
- [ ] Auto-promotion works when someone cancels

#### My Registrations Page
- [ ] Page loads without errors
- [ ] See all upcoming registrations
- [ ] Can switch to Waitlist tab
- [ ] Can switch to Past Events tab
- [ ] Can view QR code ticket
- [ ] Can cancel registration
- [ ] Confirmation dialog appears

#### Ticket System
- [ ] Ticket modal opens
- [ ] Shows QR code
- [ ] Shows ticket code
- [ ] Shows event details
- [ ] Shows guest list (if any)
- [ ] Download button present

### Mobile Responsiveness
- [ ] Registration modal works on mobile
- [ ] My Registrations page responsive
- [ ] Ticket modal responsive
- [ ] All buttons accessible on mobile

### Code Quality
- [ ] No console errors
- [ ] No import errors
- [ ] All modals close properly
- [ ] Loading states work
- [ ] Error messages display correctly

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@components/registration/RegistrationModal'"

**Solution:**
- Verify folder exists: `src/components/registration/`
- Check file name spelling (case-sensitive)
- Restart dev server

### Issue: Registration not persisting

**Solution:**
- Check localStorage in browser DevTools
- Clear localStorage and try again
- Verify `storage.js` functions work

### Issue: Waitlist not promoting automatically

**Solution:**
- Check `promoteFromWaitlist()` function
- Verify waitlist position sorting
- Check capacity calculations

### Issue: Guest validation not working

**Solution:**
- Verify email ends with @umd.edu
- Check error state in RegistrationModal
- Review form validation logic

### Issue: QR code not displaying

**Solution:**
- Check QR code data format
- Verify SVG encoding
- Check img src attribute

---

## 📊 Integration Points

### Phase 2 → Phase 3

**Uses from Phase 2:**
- EventsPage structure
- EventCard component
- EventDetailModal component
- Event service functions
- Event utilities

**Adds to Phase 2:**
- Registration modal integration
- Capacity updates after registration
- Registration status checking

### Phase 1 → Phase 3

**Uses from Phase 1:**
- Authentication context
- User data
- Navigation
- Protected routes

---

## 🎯 Key Dependencies

From Previous Phases (Already Installed):
- react-router-dom
- lucide-react
- tailwindcss

**No new dependencies required!**

---

## 📝 Data Flow

### Registration Flow

```
1. User clicks "Register for Event"
2. EventsPage checks registration status
3. Opens RegistrationModal (or waitlist modal)
4. User fills form and submits
5. registrationService.registerForEvent() called
6. If capacity available:
   - Create registration
   - Generate ticket code and QR
   - Save to localStorage
   - Update event capacity
7. If full:
   - Add to waitlist
   - Assign position
   - Save to localStorage
8. Show success message
9. Reload events data
```

### Cancellation Flow

```
1. User clicks "Cancel" on registration
2. Confirmation dialog appears
3. User confirms
4. registrationService.cancelRegistration() called
5. Mark registration as cancelled
6. Release capacity
7. Check waitlist
8. If waitlist exists:
   - Promote first person
   - Auto-register them
   - Send notification (backend)
9. Reload registrations data
```

---

## 🚀 After Completion

Once all files are created and verified:

1. **Test All Flows**: Registration, waitlist, cancellation
2. **Test on Different Devices**: Desktop, tablet, mobile
3. **Take Screenshots**: For documentation
4. **Share Mock Data**: With backend team
5. **Prepare for Phase 4**: Organizer features

---

## 💡 Quick Test Script

```bash
# Test user flow
1. Login as student@umd.edu / student123
2. Navigate to Events page
3. Click on "Mental Health Awareness Workshop"
4. Click "Register for Event"
5. Add a guest: "Test Guest" / testguest@umd.edu
6. Select "Email & SMS"
7. Click "Confirm Registration"
8. Go to "My Registrations"
9. Verify registration appears
10. Click "View QR Code"
11. Try to cancel registration
```

---

## ✅ Phase 3 Completion Checklist

- [ ] All 9 new files created
- [ ] All 2 files updated
- [ ] Registration flow works end-to-end
- [ ] Waitlist functionality works
- [ ] Guest management works
- [ ] My Registrations page loads
- [ ] Tickets display correctly
- [ ] Cancellation works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Documentation complete

---

**Phase 3 File Setup Complete! ✨**

Ready to test the full registration experience!