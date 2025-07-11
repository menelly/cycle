/**
 * DEFAULT DATA LOADER
 * 
 * Provides plausible deniability by loading realistic-looking default data
 * when someone first sets up their PIN. Can be cleared later or restored
 * via the panic button.
 */

import { useDailyData, formatDateForStorage, CATEGORIES } from './database'
import { subDays, format } from 'date-fns'

export interface DefaultDataEntry {
  date: string
  category: string
  subcategory: string
  content: any
  tags: string[]
}

/**
 * Generate realistic default data that looks like someone downloaded
 * the app but barely used it
 */
export function generateDefaultData(): DefaultDataEntry[] {
  const today = new Date()
  const entries: DefaultDataEntry[] = []

  // Add a few sparse journal entries that look like someone tried the app and forgot about it
  const journalEntries = [
    {
      date: formatDateForStorage(subDays(today, 45)),
      content: {
        title: "Downloaded new app",
        content: "Found this cycle tracking app, seems okay. Setting it up.",
        mood: "neutral",
        tags: ["setup"]
      }
    },
    {
      date: formatDateForStorage(subDays(today, 38)),
      content: {
        title: "Trying to remember to use this",
        content: "Keep forgetting to log stuff. Maybe I'll get better at it.",
        mood: "neutral", 
        tags: ["reminder"]
      }
    },
    {
      date: formatDateForStorage(subDays(today, 12)),
      content: {
        title: "Still not using this much",
        content: "I should probably delete this app, I never remember to use it.",
        mood: "neutral",
        tags: ["unused"]
      }
    }
  ]

  // Add journal entries
  journalEntries.forEach(entry => {
    entries.push({
      date: entry.date,
      category: CATEGORIES.JOURNAL,
      subcategory: 'daily-journal',
      content: entry.content,
      tags: entry.content.tags
    })
  })

  // Add minimal reproductive health data - just a couple entries to look realistic
  const reproductiveEntries = [
    {
      date: formatDateForStorage(subDays(today, 42)),
      content: {
        flow: 'medium',
        pain: 3,
        mood: ['tired'],
        symptoms: ['cramps'],
        libido: 2,
        cervicalFluid: '',
        bbt: null,
        energyLevel: 'low',
        fertilitySymptoms: [],
        opk: null,
        ferning: null,
        spermEggExposure: false,
        lmpDate: null,
        notes: 'First day tracking',
        tags: ['period', 'first-time']
      }
    },
    {
      date: formatDateForStorage(subDays(today, 41)),
      content: {
        flow: 'light',
        pain: 2,
        mood: ['okay'],
        symptoms: [],
        libido: 2,
        cervicalFluid: '',
        bbt: null,
        energyLevel: 'medium',
        fertilitySymptoms: [],
        opk: null,
        ferning: null,
        spermEggExposure: false,
        lmpDate: null,
        notes: '',
        tags: ['period']
      }
    }
  ]

  reproductiveEntries.forEach(entry => {
    entries.push({
      date: entry.date,
      category: CATEGORIES.TRACKER,
      subcategory: 'reproductive-health',
      content: entry.content,
      tags: entry.content.tags
    })
  })

  return entries
}

/**
 * Load default data into the database
 */
export async function loadDefaultData(): Promise<void> {
  const { saveData } = useDailyData()
  const defaultEntries = generateDefaultData()

  try {
    // Save all default entries
    for (const entry of defaultEntries) {
      await saveData(
        entry.date,
        entry.category,
        entry.subcategory,
        entry.content,
        entry.tags
      )
    }

    // Mark that default data has been loaded
    localStorage.setItem('default-data-loaded', 'true')
    
    console.log('Default data loaded successfully')
  } catch (error) {
    console.error('Failed to load default data:', error)
    throw error
  }
}

/**
 * Check if default data has been loaded
 */
export function hasDefaultDataBeenLoaded(): boolean {
  return localStorage.getItem('default-data-loaded') === 'true'
}

/**
 * Clear the default data flag (used when user deletes default data)
 */
export function clearDefaultDataFlag(): void {
  localStorage.removeItem('default-data-loaded')
}

/**
 * Delete all default data from the database
 */
export async function deleteDefaultData(): Promise<void> {
  const { deleteData } = useDailyData()
  const defaultEntries = generateDefaultData()

  try {
    // Delete all default entries
    for (const entry of defaultEntries) {
      await deleteData(entry.date, entry.category, entry.subcategory)
    }

    // Clear the flag
    clearDefaultDataFlag()
    
    console.log('Default data deleted successfully')
  } catch (error) {
    console.error('Failed to delete default data:', error)
    throw error
  }
}

/**
 * Restore default data (panic button functionality)
 * This NUKES all existing data and replaces it with defaults
 */
export async function restoreDefaultData(): Promise<void> {
  try {
    // Clear all existing data
    const databases = ['daily-data', 'tracker-data', 'journal-data']
    
    for (const dbName of databases) {
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
        const deleteRequest = indexedDB.deleteDatabase(dbName)
        await new Promise((resolve, reject) => {
          deleteRequest.onsuccess = () => resolve(true)
          deleteRequest.onerror = () => reject(deleteRequest.error)
        })
      }
    }

    // Clear localStorage flags
    localStorage.removeItem('default-data-loaded')
    
    // Wait a moment for databases to be fully cleared
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Load fresh default data
    await loadDefaultData()
    
    console.log('All data restored to defaults (panic button activated)')
  } catch (error) {
    console.error('Failed to restore default data:', error)
    throw error
  }
}
