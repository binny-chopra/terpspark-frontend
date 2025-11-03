# TerpSpark Phase 4 - Organizer Event Management

## 🎉 New Features Added

Phase 4 introduces comprehensive event management tools for organizers to create, manage, and track their events with attendee management capabilities.

---

## ✅ Features Implemented

### 1. **Event Creation (FR-2)**
- Complete event creation form with validation
- All required fields with proper validation
- Category selection from approved list
- Date/time pickers with validation
- Venue and location fields
- Capacity management (1-5000)
- Tags for categorization
- Optional image URL
- Submit for admin approval workflow

### 2. **My Events Dashboard**
- View all organizer's events
- Filter by status (All/Draft/Pending/Published/Cancelled)
- Event statistics cards
- Status-based organization
- Quick action menu per event
- Visual status indicators

### 3. **Event Management (FR-4, FR-11)**
- Edit draft and pending events
- Cancel published events
- Duplicate existing events
- View event details
- Status tracking
- Change history (structure ready)

### 4. **Attendee Management (FR-10)**
- View all registered attendees
- Search attendees by name/email
- Check-in status tracking
- Guest information display
- Export attendees to CSV
- Attendee statistics dashboard

### 5. **Communication Tools (FR-10)**
- Send announcements to all attendees
- Bulk email/SMS notifications (UI ready)
- Message composition interface
- Delivery confirmation

### 6. **Event Statistics**
- Total registrations count
- Checked-in count
- Not checked-in count
- Capacity utilization
- Waitlist count (if applicable)
- Real-time updates

---

## 📦 New Files Added

### Service Files
- `src/services/organizerService.js` - Organizer-specific operations

### Component Files
- `src/components/organizer/` - New directory
- `src/components/organizer/OrganizerEventCard.jsx` - Event card for organizers

### Page Files
- `src/pages/CreateEventPage.jsx` - Event creation form
- `src/pages/MyEventsPage.jsx` - Organizer dashboard
- `src/pages/EventAttendeesPage.jsx` - Attendee management

### Updated Files
- `src/App.jsx` - Added organizer routes
- `src/utils/constants.js` - Added new route constants

---

## 🚀 How to Use

### Installation

No new dependencies needed! Just update the files.

```bash
npm run dev
```

### Testing Phase 4 Features

#### 1. Login as Organizer

```
Email: organizer@umd.edu
Password: organizer123
```

#### 2. Create Your First Event

1. **Navigate** to "My Events" in navigation
2. **Click** "Create Event" button (top right)
3. **Fill out the form:**
   - Event Title: "Test Workshop"
   - Description: At least 50 characters
   - Category: Select any
   - Date: Future date
   - Start Time: e.g., 14:00
   - End Time: e.g., 16:00
   - Venue: "Test Room 101"
   - Location: "Test Building"
   - Capacity: 50
   - Tags: "test, workshop" (optional)
4. **Click** "Create Event"
5. **Success!** Event is created with "Pending" status

#### 3. View My Events

1. **Go to** "My Events"
2. **See your event** in the "Pending" tab
3. **View statistics:**
   - Total Events
   - Draft count
   - Pending count
   - Published count
   - Cancelled count

#### 4. Manage Event

1. **Click** the three dots (⋮) on any event card
2. **Available actions:**
   - Edit Event (for draft/pending)
   - View Attendees (for published)
   - Duplicate Event
   - Cancel Event (for published)

#### 5. View Attendees (Mock Data)

1. **Find a published event** (from mock data - e.g., "Mental Health Workshop")
2. **Click** three dots → "View Attendees"
3. **See attendee list** with:
   - Names and emails
   - Registration dates
   - Guest information
   - Check-in status
4. **Use search** to filter attendees
5. **Export CSV** to download list
6. **Send Announcement** to notify all

#### 6. Duplicate Event

1. **Click** three dots on any event
2. **Click** "Duplicate"
3. **New draft created** with "(Copy)" suffix
4. **Edit** the duplicate to change dates/details

---

## 📊 Mock Data Structure

### Organizer Event Object

```json
{
  "id": 1234567890,
  "title": "Event Title",
  "description": "Event description...",
  "category": "technology",
  "organizer": {
    "id": 2,
    "name": "Jane Smith",
    "email": "organizer@umd.edu"
  },
  "date": "2025-11-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "venue": "Room Name",
  "location": "Building Name",
  "capacity": 50,
  "registeredCount": 0,
  "waitlistCount": 0,
  "status": "pending",
  "imageUrl": null,
  "tags": ["tag1", "tag2"],
  "createdAt": "2025-11-01T10:00:00Z",
  "publishedAt": null,
  "isFeatured": false
}
```

### Event Status Values

- **draft**: Not yet submitted
- **pending**: Awaiting admin approval
- **published**: Approved and visible to students
- **cancelled**: Event cancelled

---

## 🔌 API Endpoints for Backend Team

### Organizer Event Endpoints

```
POST /api/organizer/events
Body: {
  title, description, category, date, startTime, endTime,
  venue, location, capacity, tags, imageUrl, organizerId
}
Response: { success: boolean, message: string, event: Event }

GET /api/organizer/events/:organizerId
Response: { success: boolean, events: Event[] }

PUT /api/organizer/events/:eventId
Body: { ...eventData }
Response: { success: boolean, message: string, event: Event }

DELETE /api/organizer/events/:eventId
Response: { success: boolean, message: string }

POST /api/organizer/events/:eventId/duplicate
Response: { success: boolean, event: Event }

GET /api/organizer/events/:eventId/attendees
Response: { success: boolean, attendees: Attendee[] }

POST /api/organizer/events/:eventId/announcement
Body: { message: string }
Response: { success: boolean, message: string }
```

---

## 🎯 Requirements Met

### Functional Requirements

| Requirement | Status | Implementation |
|------------|--------|----------------|
| FR-2: Event creation | ✅ Complete | CreateEventPage with validation |
| FR-3: Admin approval | 🟡 Pending | Status workflow ready |
| FR-4: Edit/cancel events | ✅ Complete | Event management actions |
| FR-10: Attendee list/export | ✅ Complete | EventAttendeesPage |
| FR-10: Send announcements | ✅ Complete | Announcement modal |
| FR-11: Duplicate event | ✅ Complete | Duplicate functionality |

### Non-Functional Requirements

| Requirement | Status | Implementation |
|------------|--------|----------------|
| NFR-1: Responsive UI | ✅ Complete | Mobile-first design |
| NFR-2: Browser compatibility | ✅ Complete | Modern standards |
| FR-20: User-friendly errors | ✅ Complete | Form validation |

---

## 🎨 Component Architecture

### Page Hierarchy

```
CreateEventPage
├── Header (shared)
├── Navigation (shared)
└── Event Creation Form
    ├── Basic Info Section
    ├── Date/Time Section
    ├── Venue Section
    ├── Capacity Section
    └── Submit Actions

MyEventsPage
├── Header (shared)
├── Navigation (shared)
└── Events Management
    ├── Stats Cards
    ├── Status Tabs
    └── OrganizerEventCard (repeated)
        └── Actions Menu

EventAttendeesPage
├── Header (shared)
├── Navigation (shared)
└── Attendees Management
    ├── Stats Cards
    ├── Search Bar
    ├── Attendees Table
    └── Announcement Modal
```

---

## 💾 Data Persistence

Uses **localStorage** key:
- `terpspark_organizer_events` - Array of organizer-created events

**Note:** Mock events from `mockEvents.json` are combined with stored events.

---

## 🧪 Testing Scenarios

### Event Creation Tests

- [ ] Create event with all required fields
- [ ] Try to submit with missing title (should fail)
- [ ] Try short description < 50 chars (should fail)
- [ ] Select category from dropdown
- [ ] Set past date (should fail)
- [ ] Set end time before start time (should fail)
- [ ] Set capacity < 1 or > 5000 (should fail)
- [ ] Add optional tags
- [ ] Cancel creation
- [ ] Submit successfully

### My Events Tests

- [ ] View all events
- [ ] Filter by status tabs
- [ ] See event counts update
- [ ] View draft events
- [ ] View pending events
- [ ] View published events
- [ ] View cancelled events

### Event Management Tests

- [ ] Edit draft event
- [ ] Edit pending event
- [ ] Try to edit published event (should be read-only or limited)
- [ ] Duplicate any event
- [ ] Cancel published event
- [ ] View attendees for published event

### Attendee Management Tests

- [ ] View attendee list
- [ ] Search by name
- [ ] Search by email
- [ ] See check-in status
- [ ] See guest count
- [ ] Export CSV
- [ ] Send announcement
- [ ] See stats update

---

## 📱 Responsive Design

All Phase 4 pages are fully responsive:

- **Desktop**: Multi-column layouts, full tables
- **Tablet**: Adjusted grids, scrollable tables
- **Mobile**: Single column, stacked forms, mobile-optimized tables

---

## 🎨 UI/UX Highlights

### Form Validation

- **Inline validation**: Errors show immediately
- **Character counter**: For description field
- **Date validation**: Prevents past dates
- **Time validation**: End must be after start
- **Clear messaging**: Helpful error messages

### Status Indicators

- **Gray**: Draft
- **Orange**: Pending Approval
- **Green**: Published
- **Red**: Cancelled

### Actions Menu

- **Context-aware**: Shows relevant actions only
- **Visual separation**: Dangerous actions separated
- **Confirmation dialogs**: For destructive actions

---

## 🔐 Business Logic

### Event Creation Rules

1. All required fields must be filled
2. Description minimum 50 characters
3. Event date cannot be in past
4. End time must be after start time
5. Capacity between 1 and 5000
6. Category must be from approved list
7. Tags are optional but formatted
8. Events start in "pending" status

### Event Management Rules

1. Can edit: draft, pending status only
2. Can cancel: published status only
3. Can duplicate: any event you own
4. Cannot delete: only cancel
5. Status workflow: draft → pending → published → cancelled

### Attendee Access Rules

1. Can only view attendees for your own events
2. Can only view published events' attendees
3. Export includes all attendee data
4. Announcements go to all registered users

---

## 🐛 Known Limitations

1. **Event editing**: Full edit page not yet implemented (Phase 5)
2. **Admin approval**: UI ready, admin dashboard pending
3. **Real attendees**: Using mock data for now
4. **Check-in scanning**: QR scanning Phase 5
5. **Image upload**: Only URL input (no file upload)
6. **Multi-session events**: Structure ready, UI pending
7. **Version history**: Logged but not displayed

---

## 🔜 Next Steps (Phase 5)

- Event editing page
- Admin approval dashboard
- Event moderation queue
- Category/venue management
- Audit logs viewer
- Check-in QR scanning
- Advanced analytics

---

## 💡 Tips for Developers

### Adding a New Event Field

1. Update `CreateEventPage` form
2. Add to `organizerService.createEvent()`
3. Update validation in `validateForm()`
4. Display in `OrganizerEventCard`

### Customizing Status Workflow

Edit status badges in:
- `OrganizerEventCard.jsx`
- `MyEventsPage.jsx` tabs

### Changing Capacity Limits

Edit validation in `CreateEventPage.jsx`:
```javascript
else if (parseInt(formData.capacity) > 5000) {
  // Change 5000 to your desired max
}
```

---

## 📞 Support

For questions about Phase 4 implementation, contact the development team.

---

**Phase 4 Complete! ✨**

Organizers can now create and manage events!

Ready for Phase 5: Admin Features & Advanced Management