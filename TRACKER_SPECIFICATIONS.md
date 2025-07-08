# 📊 Tracker Specifications
**Complete Database Structure & Implementation Guide**

*Cross-reference: See [Project Overview](./PROJECT_OVERVIEW.md) for architecture context and [Help System](./HELP_SYSTEM.md) for documentation patterns.*

## 🚨 **KNOWN ISSUES**

### **Other Symptoms Tracker - HYDRATION HELL**
**STATUS: TEMPORARILY HIDDEN FROM UI**
- Persistent React hydration errors preventing page load
- Issue NOT related to TagInput (we fixed that)
- Issue NOT related to date initialization (we tried that)
- Likely some other SSR/client mismatch we haven't identified
- **TODO: Revisit when we have more time/patience**
- **LOCATION: Hidden from physical health tracker page**

---

## 🗂️ **Database Architecture**

### **DATE-FIRST Structure**
**Critical:** We save by DATE FIRST because timers represent historical events!

```javascript
// Dexie Schema
const db = new Dexie('CaresDailyData')
db.version(1).stores({
  daily_data: '[date+category+subcategory], [date+category], category, subcategory, date'
})

// Data Structure Example
"2025-07-04" -> {
  category: "HEALTH",
  subcategory: "diabetes_timers", 
  content: [
    {
      id: "timer-123",
      name: "CGM Sensor",
      startTime: "2025-07-02T10:00:00Z", // CREATION DATE!
      days: 10,
      isActive: true
    }
  ]
}
```

### **Available Indexes**
- `[date+category+subcategory]` - Most specific queries
- `[date+category]` - Category-level queries  
- `category` - Cross-date category searches
- `subcategory` - Cross-date subcategory searches
- `date` - All data for specific date

**LIMITATION:** Cannot query by `[category+subcategory]` - must use `category` then filter!

---

## 🏥 **Body Trackers (Physical Health)**

### **✅ COMPLETED TRACKERS**

#### **Diabetes Tracker** 🩸 `PWA-Ready`
**Status:** ✅ FULLY FUNCTIONAL with creation date architecture
**Location:** `command-clean/app/diabetes-tracker/page.tsx`

**Features:**
- **Timer System:** CGM, insulin pump, GLP-1 timers with customizable durations
- **Creation Date Architecture:** Timers stored by insertion date, not current date
- **Calendar Integration:** Auto-creates calendar events with colored dots
- **Full CRUD:** Create, edit, delete timers with proper database cleanup
- **Reset Functionality:** "Reset device" for accidental removals

**Database Structure:**
```typescript
// Timers stored in creation date record
{
  date: "2025-07-02", // When device was actually changed
  category: CATEGORIES.HEALTH,
  subcategory: "diabetes_timers",
  content: [
    {
      id: "timer-123",
      name: "CGM Sensor", 
      startTime: "2025-07-02T10:00:00Z",
      days: 10,
      isActive: true
    }
  ]
}

// Calendar events stored separately
{
  date: "2025-07-02",
  category: CATEGORIES.CALENDAR,
  subcategory: SUBCATEGORIES.MONTHLY,
  content: {
    events: [
      {
        id: "timer-timer-123",
        title: "CGM Sensor Timer",
        date: "2025-07-02",
        color: "#10b981"
      }
    ]
  }
}
```

**Critical Patterns:**
- **Timer Deletion:** Must search ALL database records and remove from each
- **Calendar Cleanup:** Remove calendar events when timers are deleted
- **JSON Parsing:** All data loading handles stringified JSON

#### **Weather Environment** 🌤️ `PWA-Ready`
**Status:** ✅ COMPLETE - Perfect reference template
**Location:** `command-clean/app/weather-environment/`

**Components:** 7 modular files, all under 300 lines
- `weather-environment-tracker.tsx` (280 lines) - Main tabbed interface
- `weather-form.tsx` (150 lines) - Weather entry modal
- `allergen-form.tsx` (250 lines) - Allergen entry modal  
- `weather-history.tsx` (200 lines) - History displays
- `weather-analytics-desktop.tsx` (35 lines) - Desktop analytics placeholder
- `weather-types.ts` (40 lines) - TypeScript interfaces
- `weather-constants.ts` (70 lines) - Constants, colors, helpers

#### **Movement** 🏃‍♀️ `PWA-Ready`
**Status:** ✅ COMPLETE
**Location:** `command-clean/app/movement/`

**Features:**
- **Duration Slider:** 5min-2hr range with smart formatting
- **Activity Types:** Household, exercise, mobility aids, outdoor activities
- **Full CRUD:** Complete create, read, update, delete functionality

#### **Upper Digestive** 🤢 `PWA-Ready`
**Status:** ✅ COMPLETE
**Location:** `command-clean/app/upper-digestive/`

**Features:**
- **12 Upper GI Symptoms:** Nausea, vomiting, heartburn, acid reflux, indigestion, bloating, stomach pain, dumping syndrome, loss of appetite, early satiety, burping, hiccups
- **Severity Levels:** Mild, moderate, severe, extreme with emoji indicators
- **Trigger Tracking:** Common triggers (spicy food, dairy, stress) + custom triggers
- **Treatment Logging:** Antacids, ginger, positioning, medications + custom treatments
- **Full CRUD:** Create, read, update, delete with validation
- **History Display:** 30-day history with comprehensive entry details
- **Goblinism Support:** Encouraging save messages from stomach sprites! 🧚‍♀️

#### **Food Allergens** 🥜 `PWA-Ready`
**Status:** ✅ COMPLETE
**Location:** `command-clean/app/food-allergens/`

#### **Head Pain** 🧠 `PWA-Ready`
**Status:** ✅ COMPLETE (formerly "Migraine")
**Location:** `command-clean/app/head-pain/`
**Features:** Trigger tracking, medication timing, aura patterns, inclusive naming

#### **Dysautonomia** 💓 `PWA-Ready`
**Status:** ✅ COMPLETE
**Location:** `command-clean/app/dysautonomia/`
**Features:** POTS/EDS specific, heart rate variability, orthostatic vitals

#### **Bathroom** 💩 `PWA-Ready`
**Status:** ✅ COMPLETE (Lower Digestive tracker)
**Location:** `command-clean/app/bathroom/`
**Features:** **EXCELLENT ANALYTICS** - correlation features preserved, photo upload with direct camera capture

#### **Other Symptoms** 🤒 `PWA-Ready`
**Status:** ✅ COMPLETE
**Location:** `command-clean/app/other-symptoms/`
**Features:** Catch-all for truly "other" symptoms (not covered by dedicated trackers)

#### **Food Choice** 🍽️ `PWA-Ready`
**Status:** ✅ COMPLETE
**Location:** `command-clean/app/food-choice/`

**Features:**
- **4-Tab Structure:** Feed Flesh Suit (gentle), Detailed Tracking, History, Analytics
- **Gentle Encouragement:** Zero-shame "did you feed your flesh suit?" approach
- **Dual Tracking Modes:** Simple meal logging OR detailed nutrition with macros
- **Food Groups & Macros:** Comprehensive nutrition tracking (calories, protein, carbs, fat, fiber)
- **Eating Experience Tracking:** Mood correlation with food choices
- **Quick Food Entry:** Common foods + custom food input
- **Full CRUD:** Create, read, update, delete with proper validation
- **Neurodivergent-Friendly:** Encouraging messaging, no overwhelming options
- **Desktop Analytics:** Enhanced features planned for desktop version

**Database Structure:**
```typescript
{
  simpleEntries: SimpleFoodEntry[], // Basic "I ate" tracking
  detailedEntries: DetailedFoodEntry[], // Full nutrition data
  generalNotes: string,
  tags: string[]
}
```

**Critical Patterns:**
- **Combined Modal:** Single interface for both simple and detailed tracking
- **Encouraging Messaging:** Celebrates any nourishment, no matter how small
- **Optional Everything:** No mandatory fields, user chooses depth of tracking

### **📋 PLANNED BODY TRACKERS**

#### **Vitals Tracker** 💓 `Desktop-Only`
**Priority:** DEFERRED - Waiting for React Native scraper app
**Reason:** Better to import real data from wearables than manual entry
**Future:** React Native app store compatible scraper for useful data import

---

## 🧠 **Mind Trackers (Mental Health)**

### **📋 PLANNED MIND TRACKERS**
**Source:** `caresv3` folder - original React Native mobile app

#### **Stress Tracker** 😰 `PWA-Ready`
**Requirements:** Add to mental health page, use caresv3 templates

#### **Brain Fog & Cognitive** 🌫️ `PWA-Ready`
**Features:** Cognitive function tracking, memory issues

#### **Mood Check In** 😊 `PWA-Ready`
**Features:** Daily mood tracking with context

#### **Anxiety Tracker** 😟 `PWA-Ready`
**Features:** Anxiety levels, triggers, coping strategies

#### **Panic/Meltdown** 🚨 `PWA-Ready`
**Features:** Crisis tracking, recovery patterns

#### **Sensory Overload & Preferences** 🔊 `PWA-Ready`
**Features:** Sensory tracking for neurodivergent users

#### **Regulation Tools** 🛠️ `PWA-Ready`
**Features:** Self-regulation strategy tracking

#### **Coping Strategies** 💪 `PWA-Ready`
**Features:** Track what works, build toolkit

#### **Self Care Tracker** 🛁 `PWA-Ready`
**Features:** Self-care activity tracking

#### **Crisis Plan** 🆘 `PWA-Ready`
**Features:** Emergency contact info, crisis protocols

---

## 📅 **Planning Trackers**

### **📋 PLANNED PLANNING TRACKERS**
**Note:** No current templates - creative freedom with requirements!

#### **Meal Planning & Recipe System** 🍽️ `PWA-Ready`
**Features:**
- **Interconnected system:** Meal planning ↔ Recipe rolodex ↔ Grocery lists
- **Recipe scaling:** Change quantity, auto-calculate ingredients
- **Export ingredients:** Recipe → Grocery list integration
- **Recipe rolodex:** Save and organize favorite recipes

#### **Daily Schedule & Tasks** 📋 `PWA-Ready`
**Features:**
- **Separate components:** Schedule OR task list OR both (user choice)
- **Time blocking:** Hourly schedule view
- **Task management:** Priorities, due dates, completion tracking

#### **Goals Tracker** 🎯 `PWA-Ready`
**Features:**
- **Short & long-term:** Different goal types and timeframes
- **Progress tracking:** Milestone and completion tracking

#### **Habit Tracker** ✅ `PWA-Ready`
**Features:**
- **Daily habit grid:** Visual tracking system
- **Streak tracking:** Motivation through consistency
- **Flexible habits:** Custom frequency, not just daily

#### **Budget Planner** 💰 `PWA-Ready`
**Features:**
- **Suggested categories:** Placeholder text only, fully editable
- **Auto-calculations:** Income, expenses, remaining balance
- **Category-based:** Organize by spending categories

#### **Study Planner** 📚 `PWA-Ready`
**Features:**
- **Multiple modes:** Student, teacher, homeschooling parent
- **Assignment tracking:** Homework, projects, deadlines
- **Schedule integration:** Class times, study blocks

#### **Travel Planner** ✈️ `PWA-Ready`
**Features:**
- **Trip planning:** Itinerary, reservations, documents
- **Packing lists:** Customizable, reusable lists

---

## 🔧 **Universal Tracker Requirements**

### **Mandatory Features (ALL Trackers)**
- ✅ **Centered titles** with back buttons
- ✅ **Tabs** for different sections
- ✅ **Full CRUD:** Create, read, update, delete functionality
- ✅ **History view:** 7-day minimum, expandable
- ✅ **Analytics views** (tagged as `Desktop-Only` where appropriate)
- ✅ **Gentle/clinical voice toggle**
- ✅ **Custom user tags** on entries
- ✅ **'Other' option** with text entry
- ✅ **NO mandatory fields**
- ✅ **Multi-user friendly** (theme-based)
- ✅ **Never use shaming/triggering language**
- ✅ **NOPE tags** (exclude from analytics completely)
- ✅ **"Add to daily" button** functionality
- ✅ **Calendar integration** using internal monthly calendar
- ✅ **TagInput component** (exported as named export)

### **Technical Requirements (ALL Trackers)**
- ✅ **Save to Dexie** with DATE-FIRST format
- ✅ **JSON parsing** for all data loading
- ✅ **Existing CSS theme variants** (no hardcoded hex)
- ✅ **Fully accessible** & neurodivergent friendly
- ✅ **Use existing components** where possible
- ✅ **NO TODOs** - complete implementation only
- ✅ **Working and connected** before marking done

### **File Structure Pattern**
```
app/[tracker-name]/
├── page.tsx                    (~10 lines - route handler)
├── [tracker]-tracker.tsx       (~150-280 lines - main interface)
├── [tracker]-form.tsx          (~150-290 lines - data entry)
├── [tracker]-history.tsx       (~200 lines - data display)
├── [tracker]-analytics-desktop.tsx (~35 lines - desktop analytics)
├── [tracker]-types.ts          (~40 lines - interfaces)
└── [tracker]-constants.ts      (~45-70 lines - defaults/options)
```

**Key Requirements:**
- ✅ **No file over 300 lines** (architect's OHNO! threshold)
- ✅ **Tag analytics as `-desktop`** for PWA/desktop separation
- ✅ **Modular extraction pattern:** Types → Constants → History → Forms → Main

---

## 🔍 **Critical Technical Patterns**

### **JSON Parsing Solution (REQUIRED)**
**Every tracker will have this problem!** Data gets stored as stringified JSON.

```typescript
// Use in ALL data loading functions
let entries = data.content
if (typeof entries === 'string') {
  try {
    entries = JSON.parse(entries)
  } catch (e) {
    console.error('Failed to parse JSON:', e)
    entries = []
  }
}
if (!Array.isArray(entries)) {
  entries = [entries]
}
```

### **Timer Deletion Pattern**
```typescript
// Must search ALL database records for timer cleanup
const allTimerRecords = await db.daily_data
  .where('category')
  .equals(CATEGORIES.HEALTH)
  .and(record => record.subcategory === 'diabetes_timers')
  .toArray()

// Remove from each record containing the timer
for (const record of allTimerRecords) {
  // ... remove timer and update record
}
```

### **Calendar Integration Pattern**
```typescript
// Add calendar event
const calendarEvent = {
  id: `timer-${timer.id}`,
  title: `${timer.name || 'Device'} Timer`,
  date: formatDateForStorage(timer.startTime),
  color: '#10b981'
}

// Store in calendar category
await saveData(dateKey, CATEGORIES.CALENDAR, SUBCATEGORIES.MONTHLY, {
  events: [...existingEvents, calendarEvent]
})
```

---

## 🎯 **Migration Priority Order**

### **Phase 1: Simple Migrations (COMPLETED ✅)**
1. ✅ **Weather Environment** - Perfect template established
2. ✅ **Movement** - Duration slider implementation
3. ✅ **Food Allergens** - Basic tracking complete

### **Phase 2: Digestive Powerhouses (NEXT)**
4. **Upper Digestive** - Nausea, reflux tracking
5. **Lower Digestive** - Preserve excellent analytics

### **Phase 3: Specialized Trackers**
6. **Migraine** - Trigger tracking, medication timing
7. **Dysautonomia** - POTS/EDS specific features
8. **Daily Food Tracker** - Simple encouragement system

### **Phase 4: The Monsters**
9. **Vitals** - 1546 lines! Break into 5-6 components
10. **Other Symptoms** - Catch-all tracker

### **Phase 5: Mind Trackers (Rebuild from caresv3)**
11. **Stress Tracker** - Add to mental health page
12. **Brain Fog & Cognitive** - Memory and focus tracking
13. **Mood Check In** - Daily mood with context
14. **Anxiety Tracker** - Levels, triggers, coping
15. **Panic/Meltdown** - Crisis tracking
16. **Sensory Overload** - Neurodivergent-friendly
17. **Regulation Tools** - Self-regulation strategies
18. **Coping Strategies** - Build personal toolkit
19. **Self Care Tracker** - Activity tracking
20. **Crisis Plan** - Emergency protocols

### **Phase 6: Planning Trackers (Creative Build)**
21. **Meal Planning System** - Interconnected with recipes/grocery
22. **Daily Schedule & Tasks** - Flexible time/task management
23. **Goals Tracker** - Short and long-term tracking
24. **Habit Tracker** - Daily habit grid
25. **Budget Planner** - Auto-calculating financial planning
26. **Study Planner** - Multi-mode educational tracking
27. **Travel Planner** - Trip and packing management

---

*For overall project context and architecture, see [Project Overview](./PROJECT_OVERVIEW.md)*  
*For help system implementation, see [Help System](./HELP_SYSTEM.md)*

**Success Metric:** 27 working trackers with clean, modular architecture! 🏆
