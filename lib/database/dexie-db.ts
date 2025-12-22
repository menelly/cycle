/**
 * DEXIE DATABASE SETUP
 * 
 * Unified database using Dexie wrapper for IndexedDB.
 * Date-first hierarchical storage for all app data.
 * 
 * ARCHITECTURE:
 * - One main table with date-first keys
 * - Categories: calendar, tracker, journal, user, etc.
 * - Subcategories: monthly, pain, main, demographics, etc.
 * - User-controlled tag system for advanced filtering
 */

import Dexie, { Table } from 'dexie';

// ============================================================================
// DATABASE INTERFACES
// ============================================================================

export interface DailyDataRecord {
  id?: number;
  date: string;           // '2025-06-16' - Primary organizational key
  category: string;       // 'calendar', 'tracker', 'journal', 'user'
  subcategory: string;    // 'monthly', 'pain', 'main', 'demographics'
  content: unknown;       // JSON content - flexible structure
  images?: string[];      // Array of image blob keys (for IndexedDB blob storage)
  tags?: string[];        // User-defined tags for searching
  metadata?: {
    created_at: string;
    updated_at: string;
    user_id?: string;
    version?: number;
  };
}

export interface UserTag {
  id?: number;
  tag_name: string;
  color?: string;
  category_restrictions?: string[];  // Which categories this tag can appear in
  is_hidden?: boolean;              // Hide from main views
  created_at: string;
  updated_at: string;
}

export interface ImageBlob {
  id?: number;
  blob_key: string;       // Unique key for referencing
  blob_data: Blob;        // Actual image data
  filename?: string;
  mime_type: string;
  size: number;
  created_at: string;
  linked_records?: string[]; // Which daily_data records use this image
}

// ============================================================================
// DEXIE DATABASE CLASS
// ============================================================================

export class ChaosCommandCenterDB extends Dexie {
  // Main data table - everything organized by date first
  daily_data!: Table<DailyDataRecord>;
  
  // User-controlled tag system
  user_tags!: Table<UserTag>;
  
  // Image blob storage
  image_blobs!: Table<ImageBlob>;

  constructor() {
    super('ChaosCommandCenterDB');
    
    this.version(1).stores({
      // Main data table with compound indexes for efficient queries
      daily_data: '++id, date, [date+category], [date+category+subcategory], category, subcategory, *tags, metadata.created_at',
      
      // User tag management
      user_tags: '++id, tag_name, *category_restrictions, is_hidden, created_at',
      
      // Image blob storage
      image_blobs: '++id, blob_key, mime_type, size, created_at, *linked_records'
    });
  }
}

// ============================================================================
// DATABASE INSTANCE - Lazy initialization to avoid SSR issues
// ============================================================================

let _db: ChaosCommandCenterDB | null = null;

export const getDB = (): ChaosCommandCenterDB => {
  if (typeof window === 'undefined') {
    throw new Error('Database can only be accessed on the client side');
  }

  if (!_db) {
    _db = new ChaosCommandCenterDB();
  }

  return _db;
};

// For backward compatibility
export const db = new Proxy({} as ChaosCommandCenterDB, {
  get(target, prop) {
    return getDB()[prop as keyof ChaosCommandCenterDB];
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a unique key for date/category/subcategory combination
 */
export function generateDataKey(date: string, category: string, subcategory: string): string {
  return `${date}-${category}-${subcategory}`;
}

/**
 * Parse a data key back into components
 */
export function parseDataKey(key: string): { date: string; category: string; subcategory: string } {
  const [date, category, subcategory] = key.split('-', 3);
  return { date, category, subcategory };
}

/**
 * Format date for consistent storage (timezone-safe)
 * Uses local timezone instead of UTC to prevent date shifts
 */
export function formatDateForStorage(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` // '2025-06-16'
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// ============================================================================
// CATEGORY CONSTANTS
// ============================================================================

export const CATEGORIES = {
  CALENDAR: 'calendar',
  TRACKER: 'tracker',
  JOURNAL: 'journal',
  USER: 'user',
  PLANNING: 'planning',
  HEALTH: 'health',
  DAILY: 'daily'
} as const;

export const SUBCATEGORIES = {
  // Calendar
  MONTHLY: 'monthly',
  WEEKLY: 'weekly', 
  DAILY: 'daily',
  
  // Journal
  MAIN: 'main',
  BRAIN_DUMP: 'brain-dump',
  THERAPY: 'therapy',
  GRATITUDE_WINS: 'gratitude-wins',
  CREATIVE: 'creative',
  
  // User
  DEMOGRAPHICS: 'demographics',
  PROVIDERS: 'providers',
  APPOINTMENTS: 'appointments',
  SETTINGS: 'settings',
  
  // Health Trackers (examples - will expand)
  PAIN: 'pain',
  SLEEP: 'sleep',
  MOOD: 'mood',
  SYMPTOMS: 'symptoms',
  MEDICATIONS: 'medications'
} as const;

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

/**
 * Initialize database and handle any migrations
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🗃️ DEXIE: Starting database initialization...');

    await db.open();
    console.log('🗃️ DEXIE: Database opened successfully');

    // Skip default tags for now to fix loading issue
    // await ensureDefaultTags();

    console.log('🎯 DEXIE: Database initialization complete!');

  } catch (error) {
    console.error('💥 DEXIE: Database initialization failed:', error);
    throw error;
  }
}


