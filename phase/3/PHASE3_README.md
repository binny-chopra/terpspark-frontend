# TerpSpark Phase 3 - Student Registration Flow

## 🎉 New Features Added

Phase 3 introduces comprehensive student registration functionality with capacity management, waitlist support, guest handling, and ticketing system.

---

## ✅ Features Implemented

### 1. **Event Registration (FR-6)**
- One-click registration for available events
- Real-time capacity checking
- Registration confirmation with ticket generation
- Duplicate registration prevention
- Session selection for multi-day events (structure ready)

### 2. **Capacity Management & Enforcement (FR-6, FR-15)**
- Real-time capacity tracking
- Automatic full event detection
- Prevention of over-capacity registrations
- Visual capacity indicators on all event cards
- Remaining spots calculation and display

### 3. **Waitlist Management (FR-7)**
- Automatic waitlist when event is full
- FIFO (First In, First Out) queue management
- Position tracking for waitlisted users
- Automatic promotion when spots open
- Waitlist notification preferences (email/SMS)
- Leave waitlist functionality

### 4. **Guest/Plus-One Handling (FR-8)**
- Add up to 2 campus-affiliated guests per registration
- Guest name and email validation
- UMD email requirement for all guests
- Guest list management (add/remove)
- Guest capacity enforcement
- Guests included in ticket and check-in

### 5. **QR Code Ticketing**
- Unique QR code generation for each registration
- Ticket code generation (TKT-TIMESTAMP-EVENTID format)
- QR code display in ticket modal
- Download ticket functionality (placeholder)
- Scannable tickets for check-in (Phase 4)

### 6. **My Registrations Dashboard**
- View all upcoming registrations
- View past events attended
- View waitlist entries with position
- Tabbed interface (Registrations / Waitlist / Past)
- Registration cards with event details
- Quick access to tickets and QR codes

### 7. **Registration Management**
- Cancel registration functionality
- Confirmation dialogs for cancellations
- Automatic capacity update on cancellation
- Automatic waitlist promotion on cancellation
- Registration status tracking
- Check-in status display

### 8. **Notification System (FR-9 - UI Ready)**
- Registration confirmation messages
- Waitlist join confirmations
- Cancellation confirmations
- Notification preference selection
- Email and SMS option support
- Backend integration ready

---

## 📦 New Files Added

### Data Files
- `src/data/mockRegistrations.json` - Mock registration and waitlist data

### Service Files
- `src/services/registrationService.js` - Registration, waitlist, and ticketing logic

### Component Files
- `src/components/registration/` - New directory
- `src/components/registration/RegistrationModal.jsx` - Registration form modal
- `src/components/registration/RegistrationCard.jsx` - Registration display card
- `src/components/registration/WaitlistCard.jsx` - Waitlist entry card
- `src/components/registration/TicketModal.jsx` - QR code ticket viewer

### Page Files
- `src/pages/MyRegistrationsPage.jsx` - Registrations management page

### Updated Files
- `src/pages/EventsPage.jsx` - Integrated registration functionality
- `src/App.jsx` - Added My Registrations route

---

## 🚀 How to Use

### Installation

```bash
# No new dependencies needed!
# All functionality uses existing packages
npm run dev
```

### Testing Phase 3 Features

#### 1. Register for an Event

1. **Navigate to Events** page
2. **Click on any event** card to view details
3. **Click "Register for Event"** button
4. In the registration modal:
   - Optionally add guests (up to 2)
   - Select notification preference
   - Click "Confirm Registration"
5. **Success!** You'll see a confirmation message

#### 2. Add Guests

1. In the registration modal:
   - Enter guest name
   - Enter guest email (must be @umd.edu)
   - Click "Add Guest"
   - Repeat for second guest (max 2)
   - Remove guests by clicking X button

#### 3. Join Waitlist

1. Try to register for a **full event** (Basketball vs Duke)
2. Modal will show "Event is Currently Full"
3. Select notification preference
4. Click "Join Waitlist"
5. You'll be assigned a position

#### 4. View Your Registrations

1. Navigate to "My Registrations" in nav bar
2. View all your upcoming events
3. Click "View QR Code" to see your ticket
4. Click "Download" to save ticket (placeholder)

#### 5. Cancel a Registration

1. Go to My Registrations
2. Click "Cancel" on any registration
3. Confirm cancellation in dialog
4. Registration is cancelled and capacity updates

#### 6. Manage Waitlist

1. Go to "Waitlist" tab in My Registrations
2. View your position in queue
3. Click "Leave Waitlist" to remove yourself
4. If someone cancels, you'll be auto-promoted

---

## 📊 Mock Data Structure

### Registration Object

```json
{
  "id": 1,
  "userId": 1,
  "eventId": 3,
  "status": "confirmed",
  "registeredAt": "2025-10-25T14:30:00Z",
  "checkInStatus": "not_checked_in",
  "ticketCode": "TKT-001-MGH2025",
  "guests": [
    {
      "id": 1,
      "name": "Guest Name",
      "email": "guest@umd.edu",
      "userId": 4
    }
  ],
  "sessions": [],
  "qrCode": "data:image/svg+xml...",
  "reminderSent": false,
  "cancelledAt": null
}
```

### Waitlist Entry Object

```json
{
  "id": 1,
  "userId": 4,
  "eventId": 2,
  "position": 23,
  "joinedAt": "2025-10-26T12:00:00Z",
  "notificationPreference": "email_sms"
}
```

---

## 🔌 API Endpoints for Backend Team

### Registration Endpoints

```
POST /api/registrations
Body: {
  userId: number,
  eventId: number,
  guests: Guest[],
  sessions: number[],
  notificationPreference: string
}
Response: { 
  success: boolean, 
  message: string,
  registration: Registration 
}

GET /api/registrations/user/:userId
Response: { 
  success: boolean, 
  registrations: Registration[] 
}

GET /api/registrations/:registrationId
Response: { 
  success: boolean, 
  registration: Registration 
}

DELETE /api/registrations/:registrationId
Response: { 
  success: boolean, 
  message: string 
}

GET /api/registrations/check/:userId/:eventId
Response: { 
  success: boolean, 
  isRegistered: boolean,
  isWaitlisted: boolean 
}
```

### Waitlist Endpoints

```
POST /api/waitlist
Body: {
  userId: number,
  eventId: number,
  notificationPreference: string
}
Response: { 
  success: boolean, 
  message: string,
  waitlistEntry: WaitlistEntry 
}

GET /api/waitlist/user/:userId
Response: { 
  success: boolean, 
  waitlist: WaitlistEntry[] 
}

DELETE /api/waitlist/:waitlistId
Response: { 
  success: boolean, 
  message: string 
}

POST /api/waitlist/promote/:eventId
Response: { 
  success: boolean, 
  promoted: boolean,
  user: User 
}
```

---

## 🎯 Requirements Met

### Functional Requirements
- ✅ **FR-6**: Event registration with capacity enforcement
- ✅ **FR-7**: FIFO waitlist with automatic promotion
- ✅ **FR-8**: Campus-affiliated guest support (max 2)
- ✅ **FR-9**: Notification system UI (backend integration ready)
- ✅ **FR-15**: Capacity management with waitlist promotion
- ✅ Registration confirmation
- ✅ QR code generation
- ✅ Ticket management

### Non-Functional Requirements
- ✅ **NFR-1**: Responsive UI across all devices
- ✅ **NFR-2**: Modern browser compatibility
- ✅ User-friendly error messages
- ✅ Loading states for async operations

---

## 🎨 Component Architecture

### Registration Flow

```
EventsPage
├── EventDetailModal
└── RegistrationModal (triggered on register)
    ├── Guest Management Form
    ├── Notification Preferences
    └── Capacity Validation

MyRegistrationsPage
├── Tabs (Registrations / Waitlist / Past)
├── RegistrationCard (for each registration)
│   └── TicketModal (on View QR Code)
└── WaitlistCard (for each waitlist entry)
```

### Service Layer

```
registrationService.js
├── getUserRegistrations()
├── getUserWaitlist()
├── registerForEvent()
├── addToWaitlist()
├── cancelRegistration()
├── leaveWaitlist()
├── checkRegistrationStatus()
└── promoteFromWaitlist() (internal)
```

---

## 💾 Data Persistence

Phase 3 uses **localStorage** for demo purposes:

- **Registration data**: `terpspark_registrations`
- **Waitlist data**: `terpspark_waitlist`
- **Automatic sync**: Updates persist across sessions
- **Event capacity**: Updates dynamically

In production, all data will be managed by backend APIs.

---

## 🔐 Business Logic

### Registration Rules

1. **Capacity Check**: Before registration, check if spots available
2. **Duplicate Prevention**: Check if user already registered
3. **Guest Limit**: Maximum 2 guests per registration
4. **Guest Validation**: All guests must have @umd.edu email
5. **Total Capacity**: Main attendee + guests must not exceed remaining capacity

### Waitlist Rules

1. **FIFO Queue**: First person to join gets first promotion
2. **Position Tracking**: Each entry has a position number
3. **Auto-Promotion**: When someone cancels, first in line is promoted
4. **Notification**: Promoted users are notified (backend will handle)
5. **Capacity Update**: Event capacity decrements when promoted

### Cancellation Rules

1. **Confirmation Required**: User must confirm cancellation
2. **Capacity Release**: Spot becomes available immediately
3. **Waitlist Promotion**: First person on waitlist auto-promoted
4. **Status Update**: Registration marked as "cancelled"
5. **No Re-registration**: Cannot re-register for cancelled event without rejoining

---

## 🧪 Testing Scenarios

### Registration Testing

- [ ] Register for available event
- [ ] Try to register for same event twice
- [ ] Register with 1 guest
- [ ] Register with 2 guests
- [ ] Try to add 3rd guest (should fail)
- [ ] Try guest with non-UMD email (should fail)
- [ ] Register for event with 1 spot left
- [ ] View ticket after registration
- [ ] Cancel registration

### Waitlist Testing

- [ ] Join waitlist for full event
- [ ] Check waitlist position
- [ ] Try to join waitlist twice (should fail)
- [ ] Leave waitlist
- [ ] Cancel someone's registration and verify auto-promotion
- [ ] View waitlist in My Registrations

### Guest Management

- [ ] Add guest with valid UMD email
- [ ] Try adding guest without @umd.edu domain
- [ ] Remove guest before submitting
- [ ] Register with guests
- [ ] View guests on registration card
- [ ] Verify guests count toward capacity

### Edge Cases

- [ ] Register when exactly 1 spot remains
- [ ] Try to register with 2 guests when 1 spot remains
- [ ] Cancel last registration (should promote from waitlist)
- [ ] Multiple concurrent registrations for last spot
- [ ] View past events (no cancel button)
- [ ] View cancelled registrations

---

## 📱 Responsive Design

All new components are fully responsive:

- **Desktop**: Full-width modals, 3-column grids
- **Tablet**: 2-column grids, adjusted modals
- **Mobile**: Single column, stacked forms, full-screen modals

---

## 🎨 UI/UX Highlights

### Visual Feedback

- **Success Messages**: Green checkmark for confirmations
- **Warning Messages**: Orange for waitlist/capacity warnings
- **Error Messages**: Red for validation errors
- **Loading States**: Spinner during API calls

### Accessibility

- **Keyboard Navigation**: All modals and forms
- **Focus Management**: Proper tab order
- **ARIA Labels**: Screen reader support
- **Color Contrast**: WCAG AA compliant
- **Form Validation**: Clear error messages

### User Guidance

- **Inline Help**: Explanatory text in forms
- **Confirmation Dialogs**: Prevent accidental actions
- **Status Badges**: Clear visual state indicators
- **Empty States**: Helpful messages with CTAs

---

## 🐛 Known Limitations

1. **QR Code**: Placeholder SVG (backend will generate real QR)
2. **Ticket Download**: Shows alert (backend PDF generation needed)
3. **SMS Notifications**: UI only (backend integration needed)
4. **Email Notifications**: UI only (backend integration needed)
5. **Session Selection**: Structure ready but not fully implemented
6. **Check-in Scanning**: Will be Phase 4 feature
7. **Concurrent Registrations**: No pessimistic locking (backend will handle)

---

## 🔜 Next Steps (Phase 4)

- Organizer event management
- Event creation and editing
- Attendee list management
- Check-in QR scanning
- Announcements to registrants
- Event duplication
- Admin approval workflows

---

## 💡 Tips for Developers

### Adding a New Registration Field

1. Update `mockRegistrations.json` structure
2. Add field to `RegistrationModal` form
3. Update `registrationService.js` logic
4. Display in `RegistrationCard` if needed

### Customizing Guest Limit

Edit `RegistrationModal.jsx`:
```javascript
if (formData.guests.length >= 2) { // Change 2 to desired limit
```

### Changing Notification Options

Edit `RegistrationModal.jsx` notification preferences section.

---

## 📞 Support

For questions about Phase 3 implementation, contact the development team.

---

**Phase 3 Complete! ✨**

Ready to proceed with Phase 4: Organizer Event Management