# 📊 DATABASE STRUCTURE BIBLE
**The Holy Grail of Cares Database Patterns**

*Read this FIRST before touching any tracker database code!*  
*This document prevents 90% of database debugging sessions.*

---

## 🎯 GOLDEN RULES

### **Rule #1: Date Types Must Match**
- **selectedDate:** ALWAYS use `string` format `'yyyy-MM-dd'`
- **Database keys:** Expect `string` dates like `"2025-07-05"`
- **NEVER mix Date objects with string dates**

### **Rule #2: Data Structure Consistency**
- **Save:** `{ entries: arrayOfEntries }`
- **Load:** `record.content.entries`
- **NEVER save raw arrays directly**

### **Rule #3: Use the Hook Pattern**
- **Import:** `import { useDailyData, CATEGORIES } from "@/lib/database"`
- **Hook:** `const { saveData, getCategoryData, deleteData } = useDailyData()`
- **NEVER import database functions directly**

---

## 🏗️ CORRECT TRACKER ARCHITECTURE

### **State Setup (COPY THIS EXACTLY):**
```typescript
export default function YourTracker() {
  const { saveData, getCategoryData, deleteData, getDateRange, isLoading } = useDailyData()
  
  // Date as STRING, not Date object!
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [entries, setEntries] = useState<YourEntryType[]>([])
  
  // ... other state
}
```

### **Loading Pattern (COPY THIS EXACTLY):**
```typescript
const loadEntries = async () => {
  try {
    const records = await getCategoryData(selectedDate, CATEGORIES.TRACKER)
    const record = records.find(record => record.subcategory === 'your-subcategory')
    
    if (record && record.content && record.content.entries) {
      let entries = record.content.entries
      
      // Handle cursed string data (from old migrations)
      if (typeof entries === 'string') {
        try {
          entries = JSON.parse(entries)
        } catch (e) {
          console.error('Failed to parse JSON:', e)
          entries = []
        }
      }
      
      setEntries(entries)
    } else {
      setEntries([])
    }
  } catch (error) {
    console.error('Error loading entries:', error)
    // Add toast error handling
  }
}
```

### **Saving Pattern (COPY THIS EXACTLY):**
```typescript
const saveEntries = async (newEntries: YourEntryType[]) => {
  try {
    await saveData(
      selectedDate,  // ← STRING, not formatDateForStorage(selectedDate)!
      CATEGORIES.TRACKER,
      'your-subcategory',
      { entries: newEntries }  // ← WRAPPED in object!
    )
    setEntries(newEntries)
  } catch (error) {
    console.error('Error saving entries:', error)
    // Add toast error handling
  }
}
```

### **Navigation Pattern (COPY THIS EXACTLY):**
```typescript
// Navigation functions
const goToPreviousDay = () => {
  setSelectedDate(prev => format(subDays(new Date(prev), 1), 'yyyy-MM-dd'))
}

const goToNextDay = () => {
  setSelectedDate(prev => format(addDays(new Date(prev), 1), 'yyyy-MM-dd'))
}

const goToToday = () => {
  setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
}
```

### **Date Display Pattern:**
```typescript
// Convert string back to Date for display
<span className="text-lg font-medium">
  {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
</span>
```

---

## 🔥 COMMON MISTAKES (AVOID THESE!)

### **❌ WRONG - Date Object Mixing:**
```typescript
// DON'T DO THIS!
const [selectedDate, setSelectedDate] = useState<Date>(new Date())  // ← Date object
await saveData(formatDateForStorage(selectedDate), ...)  // ← Converts to string
const records = await getCategoryData(selectedDate, ...)  // ← Passes Date object!
```

### **❌ WRONG - Raw Array Saving:**
```typescript
// DON'T DO THIS!
await saveData(selectedDate, CATEGORIES.TRACKER, 'subcategory', newEntries)  // ← Raw array
// Then trying to load with: record.content.entries  // ← Expects object!
```

### **❌ WRONG - Direct Database Import:**
```typescript
// DON'T DO THIS!
import { getCategoryData } from "@/lib/database"  // ← Not exported!
```

### **✅ CORRECT - Consistent String Dates:**
```typescript
// DO THIS!
const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))  // ← String
await saveData(selectedDate, ...)  // ← Uses string directly
const records = await getCategoryData(selectedDate, ...)  // ← Passes same string
```

---

## 📋 HISTORY VIEW PATTERN

### **History Loading (30 Days):**
```typescript
const loadHistoryEntries = async () => {
  setHistoryLoading(true)
  try {
    const allEntries: YourEntryType[] = []
    const today = new Date()
    
    // Load last 30 days of data
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd')  // ← STRING!
      const records = await getCategoryData(date, CATEGORIES.TRACKER)
      const record = records.find(record => record.subcategory === 'your-subcategory')
      
      if (record && record.content && record.content.entries) {
        let dayEntries = record.content.entries
        if (typeof dayEntries === 'string') {
          dayEntries = JSON.parse(dayEntries)
        }
        allEntries.push(...dayEntries)
      }
    }
    
    // Sort by timestamp (newest first)
    allEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    setHistoryEntries(allEntries)
  } catch (error) {
    console.error('Error loading history:', error)
  } finally {
    setHistoryLoading(false)
  }
}
```

---

## 🎨 WORKING EXAMPLES

### **Gold Standard Templates:**
- **`command-clean/app/bathroom/page.tsx`** - Perfect database patterns
- **`command-clean/app/upper-digestive/page.tsx`** - Recently rebuilt, clean
- **`command-clean/app/head-pain/page.tsx`** - Just debugged, perfect example

### **Copy These Imports:**
```typescript
import { useDailyData, CATEGORIES, formatDateForStorage } from "@/lib/database"
import { format, addDays, subDays } from 'date-fns'
```

---

## 🚨 DEBUGGING CHECKLIST

### **If Data Disappears on Refresh:**
1. ✅ Check: Is `selectedDate` a string or Date object?
2. ✅ Check: Are you using `formatDateForStorage()` when you shouldn't?
3. ✅ Check: Does save use `{ entries: data }` format?
4. ✅ Check: Does load look for `record.content.entries`?

### **If History Shows "0 Episodes":**
1. ✅ Check: Is history loop using string dates?
2. ✅ Check: `format(subDays(today, i), 'yyyy-MM-dd')`
3. ✅ Check: Same data structure as main loading?

### **If Import Errors:**
1. ✅ Check: Using `useDailyData()` hook, not direct imports
2. ✅ Check: Destructuring from hook: `const { saveData, getCategoryData } = useDailyData()`

---

## 💡 PRO TIPS

### **Date Consistency Test:**
```typescript
console.log('selectedDate type:', typeof selectedDate)  // Should be "string"
console.log('selectedDate value:', selectedDate)        // Should be "2025-07-05"
```

### **Data Structure Test:**
```typescript
console.log('Saving:', { entries: newEntries })  // Should be wrapped object
console.log('Loading:', record.content.entries)  // Should extract from object
```

### **Quick Fix for Broken Tracker:**
1. Copy working tracker (bathroom/upper-digestive)
2. Find/replace the subcategory name
3. Update the entry type interface
4. Modify form fields
5. **Don't change the database patterns!**

---

*This document saves hours of debugging. Bookmark it. Love it. Live by it.* 🙏✨
