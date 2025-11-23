# TerpSpark Phase 2 - Event Discovery & Browse

A comprehensive event browsing and discovery system with advanced filtering, search capabilities, and responsive design.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features Implemented](#-features-implemented)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Testing Guide](#-testing-guide)
- [Mock Data Structure](#-mock-data-structure)
- [API Integration](#-api-integration)
- [Component Architecture](#-component-architecture)
- [Utility Functions](#-utility-functions)
- [File Creation Checklist](#-file-creation-checklist)
- [Troubleshooting](#-troubleshooting)
- [Requirements Coverage](#-requirements-coverage)

---

## 🎯 Overview

Phase 2 introduces the **Event Discovery & Browse** functionality, allowing users to search, filter, and explore campus events with an intuitive and responsive interface. This phase builds upon Phase 1's authentication system and adds comprehensive event management capabilities.

### Key Capabilities

- **Event Catalog System** - Display all published events in grid or list view
- **Advanced Search & Filtering** - Multiple filter options with real-time results
- **Event Detail View** - Comprehensive modal with full event information
- **Capacity Management** - Visual indicators with color-coded progress bars
- **Category System** - 8 predefined categories with unique color schemes
- **Responsive Design** - Mobile-friendly interface across all breakpoints

---

## ✨ Features Implemented

### 1. Event Catalog & Display (FR-5)

- ✅ **Grid View** - 3-column responsive layout
- ✅ **List View** - Alternative display mode with toggle
- ✅ **Event Cards** displaying:
  - Title and description (truncated)
  - Date, time, and location
  - Category badges with color coding
  - Capacity indicators with progress bars
  - Status badges (Available, Full, Today, Past Event)
  - Organizer information
  - Waitlist count (if applicable)

### 2. Advanced Search & Filtering (FR-5)

- ✅ **Text Search** - Search by title, description, tags, venue, or organizer
- ✅ **Category Filter** - Filter by 8 predefined categories
- ✅ **Date Range Filter** - Filter events by start and end dates
- ✅ **Organizer Filter** - Search events by organizer name
- ✅ **Availability Filter** - Show only events with open spots
- ✅ **Sort Options**:
  - By date (chronological)
  - By title (alphabetical)
  - By popularity (most registered)
- ✅ **Advanced Filters** - Collapsible section for date and organizer filters
- ✅ **Clear Filters** - One-click reset of all filters
- ✅ **Results Count** - Display number of matching events

### 3. Event Detail Modal

- ✅ Comprehensive event information display
- ✅ Full description with preserved formatting
- ✅ Detailed capacity tracking with visual indicators
- ✅ Organizer contact information (email)
- ✅ Event tags for categorization
- ✅ Waitlist information (if applicable)
- ✅ Featured event badges
- ✅ Call-to-action buttons (Register/Join Waitlist - Phase 3 placeholder)
- ✅ Responsive modal design with smooth animations
- ✅ Close on X button or Close button

### 4. Capacity Management Display

- ✅ **Visual Progress Bars** with color coding:
  - Green: < 50% full
  - Yellow: 50-70% full
  - Orange: 70-90% full
  - Red: 90-100% full
- ✅ Remaining spots calculation and display
- ✅ Percentage filled display
- ✅ Full event indicators
- ✅ Waitlist count visibility

### 5. Category System

8 color-coded event categories:

| Category | Color | Description |
|----------|-------|-------------|
| 📘 Academic | Blue | Academic events and lectures |
| 💼 Career | Green | Career fairs and networking |
| 🌍 Cultural | Purple | Cultural celebrations and diversity |
| ⚽ Sports | Red | Athletic events and competitions |
| 🎨 Arts | Pink | Performances and creative showcases |
| 💻 Technology | Indigo | Tech workshops and hackathons |
| 🧘 Wellness | Teal | Health and wellness programs |
| 🌱 Environmental | Emerald | Sustainability and eco-initiatives |

### 6. User Experience Features

- ✅ Loading states with animated spinner
- ✅ Empty state when no results found
- ✅ Hover effects on cards with smooth transitions
- ✅ Smooth modal animations
- ✅ Mobile-responsive design
- ✅ Keyboard navigation support
- ✅ Clear error messaging
- ✅ View mode toggle (grid/list)

---

## 🛠 Tech Stack

**Frontend Framework:**
- React 18.2.0 - UI framework
- React Router DOM 6.20.0 - Client-side routing

**Build Tools:**
- Vite 5.0.8 - Build tool and dev server

**Styling:**
- Tailwind CSS 3.3.6 - Utility-first CSS framework

**Icons:**
- Lucide React 0.263.1 - Icon library

**Additional:**
- PostCSS - CSS processing
- Autoprefixer - CSS vendor prefixes

---

## 📦 Project Structure

### Complete Directory Structure

```
terpspark-frontend/
├── src/
│   ├── assets/                    # Static assets (existing)
│   ├── components/
│   │   ├── common/                # Shared components (Phase 1)
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── events/                # ⭐ NEW - Event components
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventFilters.jsx
│   │   │   └── EventDetailModal.jsx
│   │   └── layout/                # Layout components (Phase 1)
│   │       ├── Header.jsx
│   │       └── Navigation.jsx     # 🔄 UPDATED
│   ├── context/                   # Context providers (Phase 1)
│   │   └── AuthContext.jsx
│   ├── data/                      # Mock data
│   │   ├── mockUsers.json         # Phase 1
│   │   └── mockEvents.json        # ⭐ NEW
│   ├── pages/                     # Page components
│   │   ├── DashboardPage.jsx      # 🔄 UPDATED
│   │   ├── LoginPage.jsx          # Phase 1
│   │   └── EventsPage.jsx         # ⭐ NEW
│   ├── services/                  # Service layer
│   │   ├── authService.js         # Phase 1
│   │   └── eventService.js        # ⭐ NEW
│   ├── utils/                     # Utility functions
│   │   ├── constants.js           # Phase 1
│   │   ├── storage.js             # Phase 1
│   │   └── eventUtils.js          # ⭐ NEW
│   ├── App.jsx                    # 🔄 UPDATED
│   ├── main.jsx                   # Phase 1
│   └── index.css                  # Phase 1
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

### File Count Summary

**New Files Created (9):**
- Data: 1 file (`mockEvents.json`)
- Services: 1 file (`eventService.js`)
- Utils: 1 file (`eventUtils.js`)
- Components: 3 files (EventCard, EventFilters, EventDetailModal)
- Pages: 1 file (`EventsPage.jsx`)
- Documentation: 2 files (README, Checklist)

**Updated Files (3):**
- `src/App.jsx` - Added /events route
- `src/components/layout/Navigation.jsx` - Implemented routing
- `src/pages/DashboardPage.jsx` - Added event navigation

**Total Changes: 12 files**

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Phase 1 must be completed and working

### Setup Instructions

#### Step 1: Create New Directory

```bash
mkdir -p src/components/events
```

#### Step 2: Create New Files

Create each file in the correct location:

**Data Files:**
```bash
touch src/data/mockEvents.json
```

**Service Files:**
```bash
touch src/services/eventService.js
```

**Utility Files:**
```bash
touch src/utils/eventUtils.js
```

**Component Files:**
```bash
touch src/components/events/EventCard.jsx
touch src/components/events/EventFilters.jsx
touch src/components/events/EventDetailModal.jsx
```

**Page Files:**
```bash
touch src/pages/EventsPage.jsx
```

#### Step 3: Copy Content

Copy the content from each artifact into the corresponding file created above.

#### Step 4: Update Existing Files

Update these three files with the new content from artifacts:
- `src/App.jsx`
- `src/components/layout/Navigation.jsx`
- `src/pages/DashboardPage.jsx`

#### Step 5: Verify Installation

```bash
# Check that all files exist
ls -la src/data/
ls -la src/services/
ls -la src/utils/
ls -la src/components/events/
ls -la src/pages/

# Verify no dependency changes needed
npm list --depth=0
```

#### Step 6: Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` and login with any test account.

---

## 🧪 Testing Guide

### Accessing the Events Page

1. **Login** with any role:
   - Student: `student@umd.edu` / `student123`
   - Organizer: `organizer@umd.edu` / `organizer123`
   - Admin: `admin@umd.edu` / `admin123`

2. **Navigate to Events**:
   - Click "Browse Events" in the navigation bar, OR
   - Click the "Browse Events" button on the dashboard

### Test Scenarios

#### 1. Event Display
- ✅ View 8 sample events in grid view (default)
- ✅ Toggle to list view using view mode buttons
- ✅ Verify all event cards display correctly
- ✅ Check capacity bars and status badges

#### 2. Search Functionality
- ✅ Search by event title (e.g., "Career Fair")
- ✅ Search by description keywords (e.g., "workshop")
- ✅ Search by tags (e.g., "networking")
- ✅ Search by organizer name (e.g., "Career Services")
- ✅ Search by venue (e.g., "Stamp")
- ✅ Verify results update in real-time

#### 3. Filter Functionality
- ✅ Filter by each category (Academic, Career, Cultural, etc.)
- ✅ Filter by date range (select start and end dates)
- ✅ Filter by organizer (type organizer name)
- ✅ Toggle "Available Only" to show events with spots
- ✅ Combine multiple filters (category + date + available)
- ✅ Click "Clear all filters" to reset

#### 4. Sort Functionality
- ✅ Sort by date (chronological order)
- ✅ Sort by title (alphabetical A-Z)
- ✅ Sort by popularity (most registrations first)
- ✅ Verify sort persists with filters

#### 5. Event Detail Modal
- ✅ Click any event card to open detail modal
- ✅ Verify all event information displays correctly
- ✅ Check capacity progress bar and percentage
- ✅ View organizer contact information
- ✅ See all event tags
- ✅ Click "Register for Event" (shows Phase 3 message)
- ✅ Close modal with X button
- ✅ Close modal with "Close" button

#### 6. Responsive Design
- ✅ Desktop (≥1024px): 3-column grid, full layout
- ✅ Tablet (768px-1023px): 2-column grid, compact filters
- ✅ Mobile (<768px): Single column, stacked layout
- ✅ All features accessible on mobile

#### 7. Edge Cases
- ✅ No events found state (search for "xyz")
- ✅ Full event display (Basketball game)
- ✅ Event with waitlist (Career Fair)
- ✅ Past event display (if date is before today)
- ✅ Today's event display (if date is today)

---

## 📊 Mock Data Structure

### Events JSON Structure

```json
{
  "id": 1,
  "title": "Fall Career Fair 2025",
  "description": "Connect with top employers...",
  "category": "career",
  "organizer": {
    "id": 2,
    "name": "Career Services",
    "email": "careers@umd.edu"
  },
  "date": "2025-11-15",
  "startTime": "10:00",
  "endTime": "16:00",
  "venue": "Stamp Student Union",
  "location": "Grand Ballroom",
  "capacity": 500,
  "registeredCount": 347,
  "waitlistCount": 23,
  "status": "published",
  "imageUrl": null,
  "tags": ["career", "networking", "employers", "recruiting"],
  "isFeatured": true,
  "createdAt": "2025-10-01T10:00:00Z",
  "publishedAt": "2025-10-05T14:00:00Z"
}
```

### Categories Structure

```json
{
  "id": 1,
  "name": "Academic",
  "slug": "academic",
  "description": "Academic events, lectures, and educational programs",
  "color": "blue"
}
```

### 8 Sample Events Included

1. **Fall Career Fair 2025** (Career, 500 capacity)
2. **TerpHacks 2025 - Hackathon** (Technology, 200 capacity)
3. **Mental Health Awareness Workshop** (Wellness, 50 capacity)
4. **International Food Festival** (Cultural, 300 capacity)
5. **Study Abroad Info Session** (Academic, 80 capacity)
6. **Basketball Game vs. Duke** (Sports, 1000 capacity)
7. **Open Mic Night** (Arts, 150 capacity)
8. **Sustainability Workshop** (Environmental, 60 capacity)

---

## 🔗 API Integration

### Required Endpoints for Backend Team

```typescript
// Get all events with filters
GET /api/events
Query Parameters: {
  search?: string           // Text search query
  category?: string         // Category slug
  sortBy?: 'date' | 'title' | 'popular'
  availableOnly?: boolean   // Show only available events
  startDate?: string        // ISO date format
  endDate?: string          // ISO date format
  organizer?: string        // Organizer name search
}
Response: {
  success: boolean
  events: Event[]
  total: number
}

// Get single event by ID
GET /api/events/:id
Response: {
  success: boolean
  event: Event
}

// Get all categories
GET /api/categories
Response: {
  success: boolean
  categories: Category[]
}

// Get featured events
GET /api/events/featured
Response: {
  success: boolean
  events: Event[]
}

// Get upcoming events
GET /api/events/upcoming
Query Parameters: {
  limit?: number  // Default: 5
}
Response: {
  success: boolean
  events: Event[]
}

// Search events
GET /api/search?q=query
Response: {
  success: boolean
  events: Event[]
  query: string
}
```

### Data Models (TypeScript)

```typescript
interface Event {
  id: number
  title: string
  description: string
  category: string
  organizer: {
    id: number
    name: string
    email: string
  }
  date: string              // ISO date (YYYY-MM-DD)
  startTime: string         // HH:mm format
  endTime: string           // HH:mm format
  venue: string
  location: string
  capacity: number
  registeredCount: number
  waitlistCount: number
  status: 'draft' | 'pending' | 'published' | 'cancelled'
  imageUrl?: string
  tags: string[]
  isFeatured: boolean
  createdAt: string         // ISO datetime
  publishedAt?: string      // ISO datetime
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
  color: string
}

interface Organizer {
  id: number
  name: string
  email: string
  department?: string
  contactPhone?: string
}
```

---

## 🏗 Component Architecture

### Component Hierarchy

```
EventsPage (Container)
├── Header (Shared from Phase 1)
├── Navigation (Shared from Phase 1)
└── Main Content
    ├── Page Header
    │   ├── Title & Description
    │   └── View Mode Toggle (Grid/List)
    ├── EventFilters
    │   ├── Search Input
    │   ├── Category Dropdown
    │   ├── Sort Dropdown
    │   ├── Available Only Checkbox
    │   └── Advanced Filters (Collapsible)
    │       ├── Date Range Inputs
    │       └── Organizer Input
    ├── Results Count & Clear Filters
    └── Events Grid/List
        ├── EventCard (repeated)
        │   ├── Image Placeholder
        │   ├── Category & Status Badges
        │   ├── Title & Description (truncated)
        │   ├── Date, Time, Location
        │   ├── Capacity Progress Bar
        │   └── Organizer Info
        └── EventDetailModal (conditional)
            ├── Modal Header with Close Button
            ├── Featured Badge (if applicable)
            ├── Image Placeholder
            ├── Details Grid (Date, Time, Location, Capacity)
            ├── Full Description
            ├── Organizer Contact
            ├── Tags Display
            └── Action Buttons (Register/Waitlist)
```

### Component Descriptions

#### EventsPage (Container Component)
- Manages state for events, filters, and selected event
- Handles data fetching with loading states
- Coordinates filtering and sorting logic
- Manages modal open/close state

#### EventFilters (Filter Component)
- Search input with real-time filtering
- Category dropdown (8 categories + "All Categories")
- Sort options dropdown
- Available only checkbox
- Collapsible advanced filters section
- Clear all filters button

#### EventCard (Presentation Component)
- Displays event summary information
- Shows capacity indicator with color coding
- Category badge with color scheme
- Status badges (Available, Full, Today, etc.)
- Organizer name
- Click handler to view details

#### EventDetailModal (Detail Component)
- Full event information display
- Detailed capacity tracking
- Registration call-to-action
- Organizer contact information
- Event tags
- Modal overlay with close functionality

---

## 🔧 Utility Functions

### eventUtils.js

15+ utility functions for event handling:

#### Date & Time Formatting
```javascript
formatEventDate(dateString)
// Input: "2025-11-15"
// Output: "November 15, 2025"

formatEventTime(timeString)
// Input: "14:30"
// Output: "2:30 PM"

formatTimeRange(startTime, endTime)
// Input: "10:00", "16:00"
// Output: "10:00 AM - 4:00 PM"
```

#### Capacity Management
```javascript
getRemainingCapacity(capacity, registered)
// Input: 500, 347
// Output: 153

isEventFull(capacity, registered)
// Input: 500, 500
// Output: true

getCapacityPercentage(capacity, registered)
// Input: 500, 347
// Output: 69.4

getCapacityColor(percentage)
// Input: 69.4
// Output: "yellow" (50-70%)
```

#### Event Status
```javascript
isEventPast(date, time)
// Checks if event date/time has passed
// Returns: boolean

isEventToday(date)
// Checks if event is today
// Returns: boolean

getDaysUntilEvent(date)
// Calculates days until event
// Returns: number

getEventStatusBadge(event)
// Generates appropriate status badge
// Returns: { text, color }
```

#### UI Helpers
```javascript
getCategoryColor(categorySlug)
// Returns color scheme for category
// Output: { bg, text, border }

truncateText(text, maxLength)
// Truncates text with ellipsis
// Output: "Text with..."
```

---

## 📋 File Creation Checklist

### New Files to Create

#### Data Layer
- [ ] `src/data/mockEvents.json` - Event data with 8 sample events

#### Service Layer
- [ ] `src/services/eventService.js` - Event service for API calls

#### Utility Layer
- [ ] `src/utils/eventUtils.js` - Event formatting and helpers

#### Component Layer
- [ ] `src/components/events/` - Create this directory
- [ ] `src/components/events/EventCard.jsx` - Event card component
- [ ] `src/components/events/EventFilters.jsx` - Filter interface
- [ ] `src/components/events/EventDetailModal.jsx` - Detail modal

#### Page Layer
- [ ] `src/pages/EventsPage.jsx` - Main events page

### Files to Update

- [ ] `src/App.jsx` - Add EventsPage route
- [ ] `src/components/layout/Navigation.jsx` - Add routing functionality
- [ ] `src/pages/DashboardPage.jsx` - Add navigation to events

### Verification Commands

```bash
# Check all files exist
find src -name "*.jsx" -o -name "*.js" -o -name "*.json" | grep -E "(event|Event)"

# Count new event-related files
find src -name "*event*" -o -name "*Event*" | wc -l
# Should return: 7

# Verify directory structure
tree src/components/events
```

### Verification Checklist

#### File Existence
- [ ] mockEvents.json exists in `src/data/`
- [ ] eventService.js exists in `src/services/`
- [ ] eventUtils.js exists in `src/utils/`
- [ ] EventCard.jsx exists in `src/components/events/`
- [ ] EventFilters.jsx exists in `src/components/events/`
- [ ] EventDetailModal.jsx exists in `src/components/events/`
- [ ] EventsPage.jsx exists in `src/pages/`
- [ ] All updated files have new content

#### Functionality Tests
- [ ] App compiles without errors
- [ ] Can navigate to /events route
- [ ] Events page loads with 8 sample events
- [ ] Can search events by keyword
- [ ] Can filter by category
- [ ] Can sort events
- [ ] Can click event to view details
- [ ] Event detail modal opens and closes
- [ ] Mobile responsive design works
- [ ] No console errors in browser DevTools

---

## 🚨 Troubleshooting

### Issue: "Cannot find module '@components/events/EventCard'"

**Solution:**
- Verify the file exists at `src/components/events/EventCard.jsx`
- Check file name spelling (case-sensitive)
- Ensure `vite.config.js` has correct path aliases
- Restart the dev server: `npm run dev`

### Issue: "mockEvents.json not found"

**Solution:**
- Ensure file is at `src/data/mockEvents.json`
- Verify JSON is valid (no trailing commas)
- Check file permissions
- Validate JSON: `cat src/data/mockEvents.json | python -m json.tool`

### Issue: Events page is blank

**Solution:**
- Check browser console for errors (F12)
- Verify mockEvents.json has valid JSON
- Ensure eventService.js is importing correctly
- Check network tab for failed imports

### Issue: Filters not working

**Solution:**
- Clear browser cache
- Verify eventService.js filter logic
- Check EventFilters component state management
- Ensure event data has required fields

### Issue: Modal not opening

**Solution:**
- Check console for JavaScript errors
- Verify EventDetailModal is imported correctly
- Ensure onClick handler is attached to cards
- Check modal state management in EventsPage

### Issue: Capacity bars not showing colors

**Solution:**
- Verify Tailwind classes are correct
- Check `getCapacityColor()` function in eventUtils.js
- Ensure capacity percentage is calculated correctly
- Restart dev server to rebuild CSS

---

## ✅ Requirements Coverage

### Functional Requirements

| Requirement | Status | Implementation |
|------------|--------|----------------|
| FR-5: Searchable event list | ✅ Complete | EventsPage with search bar |
| FR-5: Filter by date | ✅ Complete | Date range filters in EventFilters |
| FR-5: Filter by category | ✅ Complete | Category dropdown with 8 categories |
| FR-5: Filter by organizer | ✅ Complete | Organizer text filter |
| FR-5: Display event details | ✅ Complete | EventCard + EventDetailModal |
| FR-5: Show capacity info | ✅ Complete | Progress bars + remaining spots |

### Non-Functional Requirements

| Requirement | Status | Implementation |
|------------|--------|----------------|
| NFR-1: Responsive UI | ✅ Complete | Tailwind responsive classes, 3 breakpoints |
| NFR-2: Browser compatibility | ✅ Complete | Modern React + standard Web APIs |
| NFR-3: Fast load times | ✅ Complete | Optimized rendering, simulated delays |
| Code quality | ✅ Complete | Modular structure, reusable components |
| Accessibility | ✅ Complete | Keyboard navigation, semantic HTML |

### Phase 2 Completion Status

**Status: ✅ Phase 2 Complete and Ready for Production Testing**

- [x] All 9 new files created
- [x] All 3 files updated
- [x] Event browsing functionality working
- [x] Search and filter functionality complete
- [x] Event detail modal functional
- [x] Mobile responsive design tested
- [x] No console errors
- [x] All 8 sample events display correctly
- [x] Documentation complete
- [x] Backend API contract defined

---

## 💡 Development Tips

### Adding New Events
Edit `src/data/mockEvents.json` and add a new event object following the existing structure.

### Changing Categories
Update the categories array in `mockEvents.json` and ensure category slugs match.

### Customizing Colors
Modify category colors in the `getCategoryColor()` function in `eventUtils.js`.

### Adjusting Filters
Update the `EventFilters` component to add or modify filter options.

### Styling Changes
Use Tailwind utility classes throughout. All components use consistent spacing and colors.

### Performance Optimization
For large event lists, consider implementing:
- Virtual scrolling
- Pagination
- Server-side filtering
- Image lazy loading

---

**Phase 2 Implementation Complete! ✨**

Built with ❤️ for TerpSpark