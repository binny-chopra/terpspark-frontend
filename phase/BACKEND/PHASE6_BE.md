# Phase 6 Backend API Requirements

## 📋 Complete API Summary for Phase 6

---

## 1️⃣ CHECK-IN SYSTEM APIs

### 1.1 Validate QR Code
**Endpoint:** `POST /api/checkin/validate-qr`

**Request:**
```json
{
  "qrCode": "QR-TKT-1699558899-3",
  "eventId": 3
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "registrationId": 1,
    "userId": 1,
    "eventId": 3,
    "ticketCode": "TKT-1699558899-3",
    "qrCode": "QR-TKT-1699558899-3",
    "status": "confirmed",
    "attendeeName": "John Doe",
    "attendeeEmail": "student@umd.edu",
    "guestCount": 0,
    "guests": [],
    "checkedIn": false,
    "checkedInAt": null
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid QR code or registration not found",
  "code": "INVALID_QR_CODE"
}
```

**Business Rules:**
- Validate QR code format
- Check if registration exists for the event
- Verify registration status is "confirmed"
- Check if already checked in
- Return attendee and guest information

---

### 1.2 Check In Attendee
**Endpoint:** `POST /api/checkin`

**Request:**
```json
{
  "eventId": 3,
  "registrationId": 1,
  "method": "qr_scan",
  "organizerId": 2
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "eventId": 3,
    "userId": 1,
    "registrationId": 1,
    "checkedInAt": "2025-11-23T14:05:00Z",
    "checkedInBy": {
      "id": 2,
      "name": "Jane Smith",
      "role": "organizer"
    },
    "method": "qr_scan",
    "attendeeName": "John Doe",
    "attendeeEmail": "student@umd.edu",
    "guestCount": 0
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Attendee already checked in",
  "code": "ALREADY_CHECKED_IN"
}
```

**Business Rules:**
- Verify organizer has permission for this event
- Check registration exists and is confirmed
- Prevent duplicate check-ins
- Log check-in with timestamp
- Include guest count in check-in record
- Create audit log entry

**Methods:**
- `qr_scan` - Scanned QR code
- `manual` - Manual check-in
- `search` - Found via search

---

### 1.3 Get Event Check-Ins
**Endpoint:** `GET /api/checkin/event/:eventId`

**Query Parameters:**
```
?method=qr_scan          // Optional: filter by method
&startDate=2025-11-01    // Optional: filter by date range
&endDate=2025-11-30
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "eventId": 3,
      "userId": 1,
      "registrationId": 1,
      "checkedInAt": "2025-11-23T14:05:00Z",
      "checkedInBy": {
        "id": 2,
        "name": "Jane Smith",
        "role": "organizer"
      },
      "method": "qr_scan",
      "attendeeName": "John Doe",
      "attendeeEmail": "student@umd.edu",
      "guestCount": 0
    }
  ]
}
```

**Business Rules:**
- Only organizers of the event or admins can access
- Return all check-ins for the event
- Support filtering by method and date range
- Sort by checkedInAt DESC

---

### 1.4 Get Check-In Statistics
**Endpoint:** `GET /api/checkin/event/:eventId/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRegistrations": 50,
    "checkedIn": 35,
    "notCheckedIn": 15,
    "checkInRate": "70.0"
  }
}
```

**Business Rules:**
- Calculate based on confirmed registrations only
- Include guests in counts
- Return percentage as string with 1 decimal

---

### 1.5 Search Attendees
**Endpoint:** `GET /api/checkin/event/:eventId/attendees`

**Query Parameters:**
```
?search=john              // Search by name, email, or ticket code
&checkedIn=false          // Optional: filter by check-in status
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "registrationId": 1,
      "userId": 1,
      "name": "John Doe",
      "email": "student@umd.edu",
      "ticketCode": "TKT-1699558899-3",
      "qrCode": "QR-TKT-1699558899-3",
      "guestCount": 0,
      "guests": [],
      "checkedIn": false,
      "checkedInAt": null,
      "registeredAt": "2025-10-28T10:30:00Z"
    }
  ]
}
```

**Business Rules:**
- Search across name, email, and ticket code
- Case-insensitive search
- Only return confirmed registrations
- Include guest information

---

### 1.6 Undo Check-In
**Endpoint:** `DELETE /api/checkin/:checkInId`

**Response:**
```json
{
  "success": true,
  "message": "Check-in undone successfully"
}
```

**Business Rules:**
- Only organizers of the event or admins can undo
- Update registration status back to not checked in
- Create audit log entry
- Optional: time limit (e.g., can only undo within 1 hour)

---

### 1.7 Export Check-Ins
**Endpoint:** `GET /api/checkin/event/:eventId/export`

**Response:**
- Content-Type: `text/csv`
- File download with check-in data

**CSV Format:**
```
ID,Attendee Name,Email,Guest Count,Checked In At,Method,Checked In By
1,John Doe,student@umd.edu,0,2025-11-23 14:05:00,qr_scan,Jane Smith
```

**Business Rules:**
- Same permissions as viewing check-ins
- Include all check-in records
- Format timestamps as readable strings

---

## 2️⃣ NOTIFICATION SYSTEM APIs

### 2.1 Get User Notifications
**Endpoint:** `GET /api/notifications/user/:userId`

**Query Parameters:**
```
?unreadOnly=true          // Optional: only unread
&type=event_reminder      // Optional: filter by type
&limit=50                 // Optional: pagination limit
&offset=0                 // Optional: pagination offset
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "type": "registration_confirmed",
      "title": "Registration Confirmed",
      "message": "You're registered for Mental Health Awareness Workshop",
      "relatedEvent": {
        "id": 3,
        "title": "Mental Health Awareness Workshop"
      },
      "isRead": false,
      "createdAt": "2025-10-28T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 120,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

**Notification Types:**
- `registration_confirmed`
- `event_reminder`
- `event_update`
- `event_cancelled`
- `waitlist_promoted`
- `waitlist_joined`
- `announcement`
- `organizer_approved`
- `organizer_rejected`
- `event_approved`
- `event_rejected`
- `system`

---

### 2.2 Get Unread Count
**Endpoint:** `GET /api/notifications/user/:userId/unread-count`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

**Business Rules:**
- Fast query (should be cached/indexed)
- Used for real-time badge updates

---

### 2.3 Mark Notification as Read
**Endpoint:** `PUT /api/notifications/:notificationId/read`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "isRead": true,
    "readAt": "2025-11-23T15:30:00Z"
  }
}
```

**Business Rules:**
- Can only mark own notifications
- Idempotent (safe to call multiple times)

---

### 2.4 Mark All as Read
**Endpoint:** `PUT /api/notifications/mark-all-read`

**Request:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 5
}
```

**Business Rules:**
- Mark all unread notifications for user
- Return count of notifications marked

---

### 2.5 Delete Notification
**Endpoint:** `DELETE /api/notifications/:notificationId`

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

**Business Rules:**
- Soft delete recommended (set deletedAt timestamp)
- Can only delete own notifications

---

### 2.6 Create Notification (System Use)
**Endpoint:** `POST /api/notifications`

**Request:**
```json
{
  "userId": 1,
  "type": "event_reminder",
  "title": "Event Reminder",
  "message": "Mental Health Awareness Workshop starts tomorrow at 2:00 PM",
  "relatedEventId": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "userId": 1,
    "type": "event_reminder",
    "title": "Event Reminder",
    "message": "Mental Health Awareness Workshop starts tomorrow at 2:00 PM",
    "relatedEvent": {
      "id": 3,
      "title": "Mental Health Awareness Workshop"
    },
    "isRead": false,
    "createdAt": "2025-11-23T10:00:00Z"
  }
}
```

**Business Rules:**
- System/admin only endpoint
- Automatically trigger based on events:
  - Registration → `registration_confirmed`
  - 24h before event → `event_reminder`
  - Event update → `event_update`
  - Waitlist promotion → `waitlist_promoted`

---

### 2.7 Get Notification Preferences
**Endpoint:** `GET /api/notifications/preferences/:userId`

**Response:**
```json
{
  "success": true,
  "data": {
    "emailNotifications": true,
    "smsNotifications": false,
    "pushNotifications": true,
    "eventReminders": true,
    "eventUpdates": true,
    "registrationConfirmations": true,
    "waitlistNotifications": true,
    "announcementNotifications": true
  }
}
```

---

### 2.8 Update Notification Preferences
**Endpoint:** `PUT /api/notifications/preferences/:userId`

**Request:**
```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "eventReminders": true,
  "weeklyDigest": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "emailNotifications": true,
    "smsNotifications": false,
    "eventReminders": true,
    "weeklyDigest": false
  },
  "message": "Preferences updated successfully"
}
```

---

## 3️⃣ USER PROFILE APIs

### 3.1 Get User Profile
**Endpoint:** `GET /api/profile/:userId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@umd.edu",
    "name": "John Doe",
    "role": "student",
    "profilePicture": "https://example.com/profile.jpg",
    "phone": "301-555-0101",
    "department": "Computer Science",
    "graduationYear": 2026,
    "bio": "Passionate about tech events",
    "interests": ["Technology", "Career Development"],
    "preferences": {
      "emailNotifications": true,
      "smsNotifications": false,
      "eventReminders": true,
      "weeklyDigest": true
    },
    "stats": {
      "eventsAttended": 12,
      "upcomingEvents": 3,
      "eventsCreated": 0
    },
    "joinedAt": "2024-09-01T00:00:00Z",
    "lastLogin": "2025-11-23T10:30:00Z"
  }
}
```

**Business Rules:**
- Users can only view own profile (unless admin)
- Include role-specific fields
- Calculate stats dynamically or cache

---

### 3.2 Update User Profile
**Endpoint:** `PUT /api/profile/:userId`

**Request:**
```json
{
  "name": "John Doe",
  "phone": "301-555-0101",
  "department": "Computer Science",
  "graduationYear": 2026,
  "bio": "Updated bio text",
  "interests": ["Technology", "Sports"],
  "profilePicture": "https://example.com/new-profile.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "phone": "301-555-0101",
    "department": "Computer Science",
    "graduationYear": 2026,
    "bio": "Updated bio text",
    "interests": ["Technology", "Sports"],
    "profilePicture": "https://example.com/new-profile.jpg",
    "updatedAt": "2025-11-23T15:45:00Z"
  },
  "message": "Profile updated successfully"
}
```

**Validation Rules:**
- Name: min 2 characters
- Phone: format XXX-XXX-XXXX (if provided)
- Email: cannot be changed (read-only)
- Profile picture: valid URL
- Graduation year: between current year and +10 years

**Business Rules:**
- Users can only update own profile
- Email is immutable
- Create audit log entry

---

### 3.3 Update Profile Picture
**Endpoint:** `PUT /api/profile/:userId/picture`

**Request (URL):**
```json
{
  "imageUrl": "https://example.com/profile.jpg"
}
```

**OR Request (File Upload):**
```
Content-Type: multipart/form-data

file: [image file]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profilePicture": "https://your-cdn.com/uploaded-image.jpg"
  },
  "message": "Profile picture updated successfully"
}
```

**Business Rules:**
- Accept URL or file upload
- If file upload:
  - Max size: 5MB
  - Allowed types: image/jpeg, image/png, image/jpg, image/webp
  - Resize/optimize image
  - Store in CDN/cloud storage
  - Return public URL

---

### 3.4 Get User Statistics
**Endpoint:** `GET /api/profile/:userId/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "eventsAttended": 12,
    "upcomingEvents": 3,
    "eventsCreated": 8,
    "totalCheckIns": 10,
    "averageRating": 4.5
  }
}
```

**Business Rules:**
- Events attended: count of past events user attended
- Upcoming events: count of future confirmed registrations
- Events created: only for organizers
- Check-ins: only for organizers (events they checked people into)

---

### 3.5 Get User Activity History
**Endpoint:** `GET /api/profile/:userId/activity`

**Query Parameters:**
```
?type=registration        // Optional: filter by type
&limit=20
&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "registration",
      "action": "Registered for event",
      "eventTitle": "Mental Health Awareness Workshop",
      "eventId": 3,
      "timestamp": "2025-10-28T15:30:00Z"
    },
    {
      "id": 2,
      "type": "check_in",
      "action": "Checked in to event",
      "eventTitle": "Career Fair 2025",
      "eventId": 1,
      "timestamp": "2025-10-15T09:00:00Z"
    }
  ]
}
```

**Activity Types:**
- `registration`
- `check_in`
- `waitlist`
- `cancellation`
- `event_created` (organizers)

---

### 3.6 Change Password
**Endpoint:** `PUT /api/profile/:userId/change-password`

**Request:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456",
  "confirmPassword": "newSecurePassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Validation Rules:**
- Current password must match
- New password min 8 characters
- New password != current password
- Confirm password must match new password

**Business Rules:**
- Hash password with bcrypt/argon2
- Invalidate existing sessions (optional)
- Send email notification
- Create audit log entry

---

### 3.7 Export User Data (GDPR)
**Endpoint:** `GET /api/profile/:userId/export`

**Response:**
- Content-Type: `application/json` or `application/zip`
- File download with all user data

**Data Included:**
- Profile information
- All registrations
- All notifications
- Activity history
- Preferences

**Business Rules:**
- User can only export own data
- Admin can export any user's data (with approval)
- Rate limit: 1 export per hour per user

---

## 4️⃣ EVENT EDITING APIs

### 4.1 Get Event for Editing
**Endpoint:** `GET /api/events/:eventId/edit`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Mental Health Awareness Workshop",
    "description": "Join us for...",
    "categoryId": 7,
    "organizerId": 2,
    "date": "2025-11-08",
    "startTime": "14:00",
    "endTime": "16:00",
    "venue": "Stamp Student Union",
    "location": "Grand Ballroom",
    "capacity": 100,
    "registeredCount": 35,
    "imageUrl": "https://example.com/event.jpg",
    "tags": ["wellness", "mental health"],
    "status": "pending",
    "createdAt": "2025-10-15T10:00:00Z",
    "submittedAt": "2025-10-15T10:05:00Z"
  }
}
```

**Business Rules:**
- Only event organizer or admin can access
- Return complete event details
- Include current registration count

---

### 4.2 Update Event
**Endpoint:** `PUT /api/events/:eventId`

**Request:**
```json
{
  "title": "Updated Event Title",
  "description": "Updated description...",
  "categoryId": 7,
  "date": "2025-11-10",
  "startTime": "15:00",
  "endTime": "17:00",
  "venue": "New Venue",
  "location": "New Room",
  "capacity": 120,
  "imageUrl": "https://example.com/new-image.jpg",
  "tags": ["wellness", "workshop"],
  "changeNote": "Changed date and increased capacity"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Updated Event Title",
    "status": "pending",
    "updatedAt": "2025-11-23T16:00:00Z"
  },
  "message": "Event updated successfully"
}
```

**Edit Permissions by Status:**

| Status | Can Edit? | What Can Edit | Notes |
|--------|-----------|---------------|-------|
| `draft` | ✅ Yes | Everything | Full edit access |
| `pending` | ✅ Yes | Everything | Requires resubmission for approval |
| `published` | ⚠️ Limited | Capacity, description only | Major changes require admin approval |
| `cancelled` | ❌ No | Nothing | Cannot edit cancelled events |

**Validation Rules:**
- Same as event creation
- Title: min 5 characters
- Description: min 50 characters
- Date: must be in future
- End time > Start time
- Capacity: 1-5000
- Capacity cannot be reduced below current registrations

**Business Rules:**
- Only event organizer or admin can update
- If status is `pending`, update resets approval status
- If status is `published`, major changes require admin approval
- Send notifications to registered users if:
  - Date/time changed
  - Venue/location changed
- Create audit log entry
- Store change history (optional)

---

### 4.3 Get Event Change History
**Endpoint:** `GET /api/events/:eventId/history`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "eventId": 3,
      "changedBy": {
        "id": 2,
        "name": "Jane Smith"
      },
      "changes": {
        "capacity": {
          "old": 100,
          "new": 120
        },
        "date": {
          "old": "2025-11-08",
          "new": "2025-11-10"
        }
      },
      "changeNote": "Changed date and increased capacity",
      "changedAt": "2025-11-23T16:00:00Z"
    }
  ]
}
```

**Business Rules:**
- Track all changes to published events
- Store old and new values
- Include who made the change
- Optional feature (nice to have)

---

## 5️⃣ REAL-TIME UPDATES (Optional - WebSocket)

### 5.1 WebSocket Connection
**Endpoint:** `WS /ws/notifications?userId=1`

**Connection:**
```javascript
const ws = new WebSocket('wss://api.example.com/ws/notifications?userId=1');
```

**Messages Received:**
```json
{
  "type": "new_notification",
  "data": {
    "id": 10,
    "title": "New Registration",
    "message": "Someone registered for your event",
    "type": "registration_confirmed",
    "createdAt": "2025-11-23T17:00:00Z"
  }
}
```

```json
{
  "type": "count_update",
  "data": {
    "unreadCount": 6
  }
}
```

**Business Rules:**
- Authenticate WebSocket connection
- Send updates when:
  - New notification created
  - Notification marked as read
  - Unread count changes
- Heartbeat/ping-pong for connection health

---

## 📊 DATABASE SCHEMA UPDATES

### New Tables Required:

#### 1. check_ins
```sql
CREATE TABLE check_ins (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  registration_id INTEGER NOT NULL REFERENCES registrations(id),
  checked_in_at TIMESTAMP NOT NULL DEFAULT NOW(),
  checked_in_by_id INTEGER NOT NULL REFERENCES users(id),
  method VARCHAR(20) NOT NULL, -- 'qr_scan', 'manual', 'search'
  guest_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(registration_id) -- Prevent duplicate check-ins
);

CREATE INDEX idx_checkins_event ON check_ins(event_id);
CREATE INDEX idx_checkins_user ON check_ins(user_id);
CREATE INDEX idx_checkins_time ON check_ins(checked_in_at);
```

#### 2. notifications
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_event_id INTEGER REFERENCES events(id),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  deleted_at TIMESTAMP, -- Soft delete
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_unread (user_id, is_read, created_at),
  INDEX idx_notifications_type (type)
);
```

#### 3. notification_preferences
```sql
CREATE TABLE notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  event_reminders BOOLEAN DEFAULT TRUE,
  event_updates BOOLEAN DEFAULT TRUE,
  registration_confirmations BOOLEAN DEFAULT TRUE,
  waitlist_notifications BOOLEAN DEFAULT TRUE,
  announcement_notifications BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. event_changes (Optional)
```sql
CREATE TABLE event_changes (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id),
  changed_by_id INTEGER NOT NULL REFERENCES users(id),
  changes JSONB NOT NULL, -- Store old/new values
  change_note TEXT,
  changed_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_event_changes_event (event_id)
);
```

### Updated Tables:

#### users (add fields)
```sql
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(500);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN department VARCHAR(100);
ALTER TABLE users ADD COLUMN graduation_year INTEGER;
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN interests JSONB; -- Array of interests
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
```

#### registrations (add check-in fields)
```sql
ALTER TABLE registrations ADD COLUMN checked_in BOOLEAN DEFAULT FALSE;
ALTER TABLE registrations ADD COLUMN checked_in_at TIMESTAMP;
```

---

## 🔐 AUTHENTICATION & PERMISSIONS

All Phase 6 endpoints require authentication via JWT token.

**Required Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Permission Matrix:**

| Endpoint | Student | Organizer | Admin |
|----------|---------|-----------|-------|
| Check-in APIs | ❌ | ✅ (own events) | ✅ (all) |
| View check-ins | ❌ | ✅ (own events) | ✅ (all) |
| Notifications (own) | ✅ | ✅ | ✅ |
| Profile (own) | ✅ | ✅ | ✅ |
| Profile (others) | ❌ | ❌ | ✅ |
| Edit event | ❌ | ✅ (own events) | ✅ (all) |

---

## ⚡ PERFORMANCE CONSIDERATIONS

### Caching Strategy:
- **Notification count**: Cache for 30 seconds
- **User profile**: Cache for 5 minutes
- **Check-in stats**: Calculate on-demand or cache for 1 minute

### Database Indexes:
```sql
-- Critical indexes
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_checkins_event_time ON check_ins(event_id, checked_in_at);
CREATE INDEX idx_registrations_checkin ON registrations(event_id, checked_in);

-- For searching attendees
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_registrations_ticket ON registrations(ticket_code);
```

### Rate Limits:
- Notifications API: 100 requests/minute per user
- Check-in API: 50 requests/minute per organizer
- Profile update: 10 requests/hour per user
- Export data: 1 request/hour per user

---

## 🔔 NOTIFICATION TRIGGERS

Backend should automatically create notifications for these events:

| Event | Notification Type | Recipients |
|-------|-------------------|------------|
| User registers | `registration_confirmed` | Registering user |
| 24h before event | `event_reminder` | All registered users |
| Event updated | `event_update` | All registered users |
| Event cancelled | `event_cancelled` | All registered users |
| Promoted from waitlist | `waitlist_promoted` | Promoted user |
| Organizer approved | `organizer_approved` | Organizer |
| Organizer rejected | `organizer_rejected` | Organizer |
| Event approved | `event_approved` | Event organizer |
| Event rejected | `event_rejected` | Event organizer |
| Announcement sent | `announcement` | Selected recipients |

---

## 📝 AUDIT LOGGING

All Phase 6 actions should create audit log entries:

```sql
INSERT INTO audit_logs (action, actor_id, target_type, target_id, details)
VALUES (
  'CHECKIN_PERFORMED',
  2, -- organizer_id
  'registration',
  1, -- registration_id
  '{"eventId": 3, "method": "qr_scan", "guestCount": 0}'
);
```

**New Audit Actions:**
- `CHECKIN_PERFORMED`
- `CHECKIN_UNDONE`
- `PROFILE_UPDATED`
- `PASSWORD_CHANGED`
- `NOTIFICATION_SENT`
- `EVENT_EDITED`

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests:
- [ ] QR code validation logic
- [ ] Duplicate check-in prevention
- [ ] Notification creation triggers
- [ ] Profile validation rules
- [ ] Edit permission checks

### Integration Tests:
- [ ] Complete check-in flow
- [ ] Notification delivery
- [ ] Profile update with audit log
- [ ] Event editing with resubmission

### Load Tests:
- [ ] 100 concurrent check-ins
- [ ] 1000 notifications sent simultaneously
- [ ] Profile page load time < 200ms

---

## 📦 SUMMARY

### Total New Endpoints: **28**

**Check-in System:** 7 endpoints
**Notifications:** 8 endpoints  
**User Profile:** 7 endpoints
**Event Editing:** 3 endpoints
**WebSocket:** 1 endpoint (optional)
**Miscellaneous:** 2 endpoints

### Critical Endpoints (Must Have):
1. POST /api/checkin/validate-qr
2. POST /api/checkin
3. GET /api/notifications/user/:userId
4. GET /api/notifications/user/:userId/unread-count
5. PUT /api/notifications/:id/read
6. GET /api/profile/:userId
7. PUT /api/profile/:userId
8. PUT /api/events/:eventId

### Nice to Have (Optional):
- WebSocket for real-time notifications
- Event change history
- User data export
- Activity history

---

## 🚀 Implementation Priority

### Phase 1 (Week 1):
1. Check-in validation & recording
2. Basic notification CRUD
3. Profile view & update

### Phase 2 (Week 2):
4. Check-in statistics & export
5. Notification preferences
6. Event editing with validation

### Phase 3 (Week 3):
7. Real-time notification updates (WebSocket)
8. Advanced features (history, export)
9. Performance optimization

---

**Phase 6 Backend APIs Complete! 🎉**

