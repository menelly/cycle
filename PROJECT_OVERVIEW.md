# 🎯 Cares Project Overview
**The Master Guide to Scope, Planning & Direction**

*Cross-reference: See [Tracker Specifications](./TRACKER_SPECIFICATIONS.md) for detailed tracker info and [Help System](./HELP_SYSTEM.md) for documentation patterns.*

---

## 🧠 **The Chaos Constitution**
*"I am the architect. You are the gremlin. Let's keep it that way."*

### **Ground Rules (No Exceptions)**
1. **We Don't Hack Things to "Fix It Later"** - Do it right once and be done
2. **Accessibility Is Not an Afterthought** - If you can't tab to it, it's not done
3. **Comment for a Goldfish with Amnesia** - Assume zero memory and half context
4. **No Vague TODOs** - Include what, why, and what it should do
5. **Code Like Memory Is Fragile** - Every file maintainable by someone with half a brain and full burnout
6. **Consent Culture Applies to Code** - Ask before changing anything beyond the specific request

---

## 🎯 **Project Vision & Current Strategy**

### **What We're Building**
**THE MEGA LIFE CONTROLLER** - A comprehensive **PWA-first life management system** that helps chronically ill and neurodivergent users manage EVERYTHING with:

#### **🏥 CARES (Health Tracking)**
- **Desktop analytics** via Electron wrapper
- **Mobile-friendly** PWA components
- **Date-first database** architecture for historical tracking
- **Timer systems** for medical devices (CGM, insulin pumps, etc.)
- **Calendar integration** for appointment and event tracking

#### **🏥 MANAGE (Medical/Life Management)**
- **Medications & Providers** (both PWA + desktop, with PWA limits)
- **Diagnoses/Timeline** (desktop powerhouse + PWA read-only for doctor visits)
- **Family History & Genetics** (desktop + PWA read-only for appointments)
- **Chore Chart & Adulting** (task tracking, adulting guidance, gentle reminders, routine building, chaos catchup)
- **Missed Work & Disability** tracking
- **Document Vault/Insurance Cards** management

#### **📋 PLAN (Life Planning)**
- **Food & Eating System** (meal planning + recipe math + QR sync to phone!)
- **Task Lists** with subtasks + smart suggestions for decision fatigue
- **Goals & Habit Trackers** with analytics and streak tracking
- **Budget Planner** (DO THE MATH FOR US!)
- **Study Planner** with decision fatigue helpers and calendar integration
- **Travel Planner** (desktop planning + PWA packing lists + QR sync)

#### **🎨 FUN (Creative & Inspiration)**
- **Creative Projects** tracking and inspiration
- **Garden Planner** for growing things
- **Reward System** for motivation
- **Inspiration Vault** for collecting ideas
- **Puzzles & Games** (and whatever else we think of!)

#### **📊 PATTERNS (Analytics - Desktop Only)**
- **Cross-tracker correlations** across ALL sections
- **Advanced visualizations** and insights
- **Export functionality** for medical appointments and life management

### **Core Philosophy: BUILT FOR ME**
*"When I lost the last version to Cursor, I decided: I'm making THIS ONE for me. I will absolutely offer it to others, of course. But if I had to start over, I am making what I WANT. Others can want it or not. ;)"*

**This means:**
- **No compromises** on features that matter to chronically ill users
- **Customizable everything** - turn sections on/off to avoid overwhelm
- **Smart automation** - let the computer do the math and thinking
- **QR sync capabilities** - desktop planning, mobile execution
- **Decision fatigue helpers** - suggest what to do next when brain is fried

### **Strategic Pivot: PWA-First Approach**
**UPDATED STRATEGY:** We switched from desktop-first back to PWA-first approach, tagging components as mobile and desktop compatible as we go. This provides better forward momentum psychology while maintaining flexibility.

**Component Tagging System:**
- 🏷️ `PWA-Ready` - Works great on mobile
- 🏷️ `Desktop-Only` - Needs full screen real estate  
- 🏷️ `Mobile-Friendly` - Could work on mobile with tweaks
- 🏷️ `Analytics-Core` - Essential for data insights

---

## 🏛️ **Tech Stack & Architecture**

### **Core Technologies**
```
COMMAND: The Mega Life Controller
├── Frontend: React + Next.js
├── Database: Dexie (IndexedDB wrapper - reliable!)
├── Desktop: Electron wrapper
├── Analytics: Custom React dashboards (desktop-focused)
├── Mobile: PWA with QR sync capabilities
├── Styling: CSS modules + shadow box buttons
└── Data: DATE-FIRST architecture (2025-06-15 -> nested categories)

Sections:
├── CARES: Health tracking (27 trackers)
├── MANAGE: Medical/life management
├── PLAN: Life planning tools
├── FUN: Creative & inspiration
└── PATTERNS: Cross-section analytics (desktop-only)
```

### **Why This Stack**
- **React:** Component reusability for eventual mobile
- **Dexie:** Reliable IndexedDB wrapper, works in Electron, PWA, and browsers
- **Next.js:** Great dev experience, can export static for Electron
- **Electron:** Native desktop feel with web tech

### **Database Architecture: DATE-FIRST**
**Critical:** We save by DATE FIRST for valid reasons - timers represent historical events!

```javascript
// Example structure
"2025-07-04" -> {
  health_data: {
    diabetes_timers: [{id: "timer1", name: "CGM", startTime: "10:00", days: 10}],
    symptoms: {pain: 7, fatigue: 5, mood: 6},
    vitals: {bp: "120/80", weight: "150lbs"}
  },
  calendar_data: {
    monthly: {events: [{id: "event1", title: "Doctor", date: "2025-07-04", color: "#blue"}]}
  }
}
```

**Dexie Schema:**
- Single `daily_data` table
- Indexes: `[date+category]`, `[date+category+subcategory]`, `category`, `subcategory`
- **Cannot query by `[category+subcategory]`** - must use `category` then filter

---

## 🎨 **UI/UX Design Principles**

### **Layout Standards**
- **Right Sidebar Navigation** (15-20px narrower than current)
- **CompendiumCanvas** wrapper for all pages
- **Shadow box buttons** (obviously clickable)
- **Modals** for popups (not transparent, with scrollbars)
- **Centered titles** with back buttons
- **Tabs** for tracker sections

### **Accessibility Requirements**
- Keyboard navigation for everything
- Screen reader friendly
- Colorblind-safe palettes
- **"If you can't tab to it, it's not done"**

### **Tracker Design Philosophy**
- **NO mandatory fields**
- **Multi-user friendly** (theme-based, not separate accounts)
- **Never use shaming/triggering language**
- **NOPE tags** (exclude from analytics completely)
- **Gentle/clinical voice toggle**
- **Custom user tags** on entries
- **'Other' option** with text entry
- **Full edit/delete functionality**

---

## 🚀 **Development Phases & Priorities**

### **Phase 1: Foundation (COMPLETED ✅)**
- ✅ Set up React + Next.js + Electron
- ✅ Implement Dexie with DATE-FIRST schema
- ✅ Build CompendiumCanvas layout wrapper
- ✅ Create sidebar navigation
- ✅ Establish component tagging system

### **Phase 2: CARES Health Tracking (IN PROGRESS 🔄)**
- ✅ **Diabetes Tracker** - Complex timer functionality with creation date architecture
- ✅ **Calendar System** - Monthly calendar with JSON event parsing
- 🔄 **Body Trackers Migration** - From app-new to command-clean (27 trackers total)
- 🔄 **Mind Trackers Rebuild** - From caresv3 source material

### **Phase 2.5: MANAGE Medical/Life Management (PLANNED 📋)**
- **Medications & Providers** (PWA + desktop with appropriate limits)
- **Diagnoses/Timeline** (desktop powerhouse + PWA read-only)
- **Family History & Genetics** (desktop + PWA read-only for doctor visits)
- **Chore Chart & Adulting** (task tracking, adulting guidance, gentle reminders, routine building, chaos catchup)
- **Missed Work & Disability** tracking system
- **Document Vault/Insurance Cards** management

### **Phase 3: PLAN Life Planning (PLANNED 📋)**
- **Food & Eating System** (meal planning + recipe math + QR sync!)
  - *Recipe builder does the math if we need bigger/smaller portions*
  - *QR sync shopping lists to phone*
- **Task Lists** with subtasks + smart suggestions for decision fatigue
- **Goals & Habit Trackers** with analytics and streak tracking
- **Budget Planner** (auto-calculating, does the math FOR US!)
- **Study Planner** with decision fatigue helpers and calendar integration
- **Travel Planner** (desktop planning + PWA packing lists + QR sync)

### **Phase 4: FUN Creative & Inspiration (PLANNED 📋)**
- **Creative Projects** tracking and inspiration management
- **Garden Planner** for growing things
- **Reward System** for motivation and achievement
- **Inspiration Vault** for collecting and organizing ideas
- **Puzzles & Games** (and whatever else we think of!)

### **Phase 5: PATTERNS Analytics Engine (PLANNED 📋)**
- **Cross-tracker correlations** across ALL sections (health, manage, plan, fun)
- **Advanced visualizations** and insights
- **Export functionality** for medical appointments and life management
- **Desktop-only powerhouse** analytics

### **Phase 6: Settings & Customization (PLANNED 📋)**
- **Complete settings submenu** to turn sections on/off (avoid overwhelm!)
- **Theme system** (multi-user support)
- **Voice toggle** (gentle/clinical)
- **QR sync configuration** and management
- **Performance optimization** and polish

### **Phase 7: AI Analytics Buddy (PLANNED 🤖)**
**AI-Enhanced Desktop Version with Mistral LLM**

#### **Why Mistral?**
- **French open-source company** (not Big Tech surveillance)
- **European privacy values** (GDPR-native thinking)
- **Actually open source** with commercial-friendly licensing
- **Perfect for ND users burnt by corporate capitalism**
- **Local processing** - your data never leaves your computer

#### **AI Features:**
- **Analytics Translation:** Python does the math, AI explains what it means in plain English
- **Pattern Recognition:** "Your migraines correlate with weather changes"
- **Decision Fatigue Support:** "Maybe make dinner before taking a bath when blood sugar is low"
- **Lab Report Parsing:** Upload PDFs → structured timeline entries
- **Timeline Building:** Help organize medical history chronologically
- **Task Prioritization:** Smart suggestions based on energy/health patterns

#### **"Choose Your AI Vibe" System:**
*"How would you like your AI to vibe? (Choose your assistant style. You can switch anytime.)"*

| Vibe Type | Description |
|-----------|-------------|
| 🧙‍♂️ **Chaos Gremlin** | Hyperverbal, irreverent, powered by spite and serotonin. May call doctors "Chaddingtons." |
| 🐢 **Gentle Snail Friend** | Soothing, validating, low-pressure tone. Will always ask if you want to slow down. |
| 🤓 **Clinical but Chill** | Explains things like a well-meaning med student with ADHD. Still emotionally aware. |
| 🧛 **Sassy Gothic Librarian** | Overly dramatic, dry sarcasm, uses phrases like "your wretched pancreas." |
| 🤖 **Default Neutral** | Just a plain assistant voice if you're overstimmed or don't want extra spice. |

#### **Two Desktop Versions:**
- **COMMAND Standard:** All features, no AI (manual data interpretation)
- **COMMAND AI-Enhanced:** Standard features + Mistral AI buddy (bigger download, local processing)

#### **Privacy-First Design:**
- **100% local processing** - Mistral runs on your computer
- **No internet required** for AI features
- **No data collection** or telemetry
- **User controls everything** - AI suggests, you decide
- **Transparent operation** - always clear when AI is helping

### **Phase 7.5: ChronoGremlin Mode™ - Executive Function Co-Pilot (PLANNED 🧠)**
**Pattern-Aware Executive Function Assistant with Memory and Concern**

#### **What ChronoGremlin Does:**
- **Reads your actual lived data** (timeline, symptoms, energy logs, past attempts)
- **Recognizes destructive patterns** like "Every time you start with dishes, you crash by 2pm"
- **Course corrects in real time** based on YOUR historical data
- **Talks like a friend who remembers shit** and believes in naps as strategy

#### **Core Features:**
- **Timeline Database:** Upload PDFs from 2008+, build complete medical/life history
- **Task Pattern Recognition:** "You've tried cleaning first 4 times. You always hit a wall by midday."
- **Energy-Aware Planning:** "Wanna try these two gentler tasks first and revisit the swamp pile later?"
- **Spoon Theory Integration:** Tracks your actual energy patterns, not neurotypical fantasies
- **Trauma-Informed Responses:** No shaming, just adaptive strategy

#### **Technical Implementation:**
```
ChronoGremlin Pipeline:
├── PDF Parser → Timeline Database (medical events, symptoms, crashes)
├── Task Metadata System (energy cost, time, sitting/standing, stress level)
├── Pattern Recognition Layer (ML or rules-based: "when X → then crash")
├── Adaptive Planning Engine (suggests alternate task ordering)
└── Chaos Assistant Output ("Hey gremlin, let's try a different approach...")
```

#### **Example Interactions:**
**Input:** "Today I need to: clean living room, do laundry, grocery shop, call insurance"

**ChronoGremlin Response:** *"Hold up, chaos friend! I see cleaning is on your list again. But the last 4 times you started with that, you tanked your whole day by noon. How about we knock out the insurance call (seated, 15min) and plan groceries (also seated) first? Then if you still have spoons, we tackle the living room. Your body rolls dice every morning - let's play the odds smart."*

#### **Why This Is Revolutionary:**
- **Not just task management** - it's trauma-informed, body-aware, neurodivergent-compatible adaptive planning
- **Learns from YOUR failures** without shaming you for them
- **Strategist for a body that's unpredictable**
- **Respects energy limits** instead of pushing through them
- **Actually helps you get things done** without blowing the whole engine

**This is what we ACTUALLY need - an assistant that understands spoon theory in practice!** 🥄✨

---

## 🔧 **Critical Technical Patterns**

### **Timer System Architecture**
**BREAKTHROUGH:** Creation Date Architecture - timers stored by insertion date, not current date!

```typescript
// CORRECT: Save to creation date
const timerCreationDate = formatDateForStorage(insertedDateTime)
const timerRecord = {
  date: timerCreationDate, // SAVE TO CREATION DATE!
  category: CATEGORIES.HEALTH,
  subcategory: 'diabetes_timers',
  content: updatedTimers,
}
```

**Why:** Timers represent historical events ("I changed my CGM on July 2nd at 10am"), not current status.

### **Calendar Integration Pattern**
```typescript
// Calendar events stored as JSON strings
const calendarEvent = {
  id: `timer-${timer.id}`,
  title: `${timer.name || 'Device'} Timer`,
  date: formatDateForStorage(timer.startTime),
  color: '#10b981' // emerald-500
}

// Store in CATEGORIES.CALENDAR with SUBCATEGORIES.MONTHLY
await saveData(dateKey, CATEGORIES.CALENDAR, SUBCATEGORIES.MONTHLY, {
  events: [...existingEvents, calendarEvent]
})
```

### **JSON Parsing Solution**
**CRITICAL:** All data loading must handle stringified JSON!

```typescript
// Pattern for all data loading functions
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

---

## 🎯 **Success Metrics**

### **Technical Goals**
- ✅ **Desktop app feels native and powerful**
- ✅ **Components are genuinely reusable for mobile**
- 🔄 **Analytics provide real health insights**
- ✅ **User can track everything they need**
- 🔄 **Data export works for medical appointments**
- 🔄 **Multi-user themes work seamlessly**

### **User Experience Goals**
- **Reduced typing fatigue** for chronically ill users
- **Intuitive navigation** with consistent patterns
- **Reliable data persistence** across sessions
- **Accessible interface** for all users
- **Flexible tracking** without mandatory fields

---

## 🔮 **Future Roadmap**

### **Mobile Strategy**
Once desktop PWA is solid:
1. **Audit tagged components** for mobile readiness
2. **Build React Native companion app** using desktop components
3. **Focus on watch/Dexcom integration** (mobile's killer feature)
4. **Desktop becomes analytics powerhouse**
5. **Mobile becomes quick-entry companion**

### **Advanced Features**
- **OCR Integration** (shelved for now - manual entry focus)
- **Provider Integration** (click-to-call functionality)
- **Watch/Wearable Integration** capabilities
- **Timeline Export** for medical appointments
- **Spoon Theory Energy** correlation tracking

---

## 📚 **Key Memories & Context**

### **Database Migration History**
- **WatermelonDB → Dexie:** Switched back to Dexie after WatermelonDB had issues
- **All trackers converted:** 17 trackers successfully migrated to Dexie
- **JSON parsing fixes:** Resolved data loading issues across all components

### **Project Emotional Context**
- **Forward momentum psychology:** Building what we always wanted, not rebuilding from ashes
- **Safety checkpoints:** Push working code to main branch, then create feature branches
- **Confidence from success:** Rebuilt Codex project successfully, proving lost projects can be restored

### **User Preferences & Design Philosophy**
- **Complex trackers first:** Start with diabetes, save simple ones for when memory issues occur
- **Manual git operations:** User prefers AI to handle git because they get worried about it
- **Consolidated documentation:** Prefer 1-2 master files instead of scattered documentation
- **Calendar integration:** Internal monthly calendar component, not external services
- **Reset functionality:** "G-Spot" protocol for emergency data reset with bland starter data
- **Built for ME:** "When I lost the last version to Cursor, I decided: I'm making THIS ONE for me. Others can want it or not. ;)"
- **No overwhelm:** Complete settings submenu to turn sections on/off as needed
- **Smart automation:** Let the computer do the math and thinking (recipe scaling, budget calculations, etc.)
- **QR sync everything:** Desktop planning, mobile execution via QR codes
- **Decision fatigue helpers:** Smart suggestions for what to do next when brain is fried

---

*For detailed tracker specifications and database structure, see [Tracker Specifications](./TRACKER_SPECIFICATIONS.md)*  
*For help system implementation, see [Help System](./HELP_SYSTEM.md)*

**Remember:** You're not rebuilding what was lost. You're building what you always wanted! 🎯✨
