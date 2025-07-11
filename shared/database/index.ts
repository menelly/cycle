/**
 * SHARED DATABASE INDEX
 * 
 * Central export file for all database functionality
 * used across the modular Command Center architecture.
 */

// Core database exports
export {
  ChaosCommandCenterDB,
  getDB,
  db,
  generateDataKey,
  parseDataKey,
  formatDateForStorage,
  getCurrentTimestamp
} from './dexie-db';

// Database types
export type {
  DailyDataRecord,
  UserTag,
  ImageBlob
} from './dexie-db';

// Database hooks
export { useDailyData } from './hooks/use-daily-data';
export { useDatabase } from './hooks/use-database';
export type { UseDatabaseReturn } from './hooks/use-database';

// Migration utilities
export * from './migration-helper';

// ============================================================================
// DATABASE CONSTANTS
// ============================================================================

/**
 * Standard categories used across the app
 */
export const CATEGORIES = {
  TRACKER: 'tracker',
  JOURNAL: 'journal', 
  CALENDAR: 'calendar',
  USER: 'user',
  SETTINGS: 'settings',
  MEDICATION: 'medication',
  PROVIDER: 'provider',
  APPOINTMENT: 'appointment'
} as const;

/**
 * Standard subcategories for trackers
 */
export const TRACKER_SUBCATEGORIES = {
  // Body trackers
  PAIN: 'pain',
  HEAD_PAIN: 'head-pain',
  ENERGY: 'energy',
  SLEEP: 'sleep',
  DYSAUTONOMIA: 'dysautonomia',
  SEIZURE: 'seizure',
  DIABETES: 'diabetes',
  REPRODUCTIVE_HEALTH: 'reproductive-health',
  BATHROOM: 'bathroom',
  UPPER_DIGESTIVE: 'upper-digestive',
  OTHER_SYMPTOMS: 'other-symptoms',
  
  // Mind trackers
  MOOD: 'mood',
  BRAIN_FOG: 'brain-fog',
  ANXIETY: 'anxiety',
  PANIC: 'panic',
  MENTAL_HEALTH: 'mental-health',
  
  // Choice trackers
  FOOD_CHOICE: 'food-choice',
  FOOD_ALLERGENS: 'food-allergens',
  MOVEMENT: 'movement',
  HYDRATION: 'hydration',
  WEATHER_ENVIRONMENT: 'weather-environment',
  
  // Custom trackers
  CUSTOM: 'custom'
} as const;

/**
 * Standard subcategories for life management
 */
export const LIFE_MANAGEMENT_SUBCATEGORIES = {
  // Plan
  SCHEDULE: 'schedule',
  MEALS: 'meals',
  CHORES: 'chores',
  ZONE: 'zone',
  
  // Manage
  MEDICATIONS: 'medications',
  PROVIDERS: 'providers',
  DEMOGRAPHICS: 'demographics',
  TIMELINE: 'timeline',
  APPOINTMENTS: 'appointments',
  MISSED_WORK: 'missed-work',
  FAMILY_HISTORY: 'family-history',
  DOCUMENT_VAULT: 'document-vault',
  
  // Patterns
  CORRELATIONS: 'correlations',
  ANALYTICS: 'analytics',
  REPORTS: 'reports'
} as const;

/**
 * Standard subcategories for core wrapper
 */
export const CORE_WRAPPER_SUBCATEGORIES = {
  AUTH: 'auth',
  NAVIGATION: 'navigation',
  CALENDAR: 'calendar',
  SETTINGS: 'settings',
  HOME: 'home'
} as const;

// Type exports for categories
export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];
export type TrackerSubcategory = typeof TRACKER_SUBCATEGORIES[keyof typeof TRACKER_SUBCATEGORIES];
export type LifeManagementSubcategory = typeof LIFE_MANAGEMENT_SUBCATEGORIES[keyof typeof LIFE_MANAGEMENT_SUBCATEGORIES];
export type CoreWrapperSubcategory = typeof CORE_WRAPPER_SUBCATEGORIES[keyof typeof CORE_WRAPPER_SUBCATEGORIES];

// ============================================================================
// DATABASE UTILITIES
// ============================================================================

/**
 * Check if a category is valid
 */
export function isValidCategory(category: string): category is Category {
  return Object.values(CATEGORIES).includes(category as Category);
}

/**
 * Check if a subcategory is valid for trackers
 */
export function isValidTrackerSubcategory(subcategory: string): subcategory is TrackerSubcategory {
  return Object.values(TRACKER_SUBCATEGORIES).includes(subcategory as TrackerSubcategory);
}

/**
 * Check if a subcategory is valid for life management
 */
export function isValidLifeManagementSubcategory(subcategory: string): subcategory is LifeManagementSubcategory {
  return Object.values(LIFE_MANAGEMENT_SUBCATEGORIES).includes(subcategory as LifeManagementSubcategory);
}

/**
 * Check if a subcategory is valid for core wrapper
 */
export function isValidCoreWrapperSubcategory(subcategory: string): subcategory is CoreWrapperSubcategory {
  return Object.values(CORE_WRAPPER_SUBCATEGORIES).includes(subcategory as CoreWrapperSubcategory);
}

/**
 * Get all subcategories for a given module type
 */
export function getSubcategoriesForModule(moduleType: 'trackers' | 'life-management' | 'core-wrapper'): readonly string[] {
  switch (moduleType) {
    case 'trackers':
      return Object.values(TRACKER_SUBCATEGORIES);
    case 'life-management':
      return Object.values(LIFE_MANAGEMENT_SUBCATEGORIES);
    case 'core-wrapper':
      return Object.values(CORE_WRAPPER_SUBCATEGORIES);
    default:
      return [];
  }
}

/**
 * Generate a data key for a specific module and subcategory
 */
export function generateModuleDataKey(
  date: string, 
  moduleType: 'trackers' | 'life-management' | 'core-wrapper',
  subcategory: string
): string {
  const category = moduleType === 'trackers' ? CATEGORIES.TRACKER : 
                   moduleType === 'life-management' ? CATEGORIES.USER :
                   CATEGORIES.SETTINGS;
  return generateDataKey(date, category, subcategory);
}

/**
 * Parse a module data key back into components
 */
export function parseModuleDataKey(key: string): { 
  date: string; 
  moduleType: 'trackers' | 'life-management' | 'core-wrapper' | 'unknown';
  subcategory: string;
} {
  const { date, category, subcategory } = parseDataKey(key);
  
  let moduleType: 'trackers' | 'life-management' | 'core-wrapper' | 'unknown' = 'unknown';
  
  if (category === CATEGORIES.TRACKER) {
    moduleType = 'trackers';
  } else if (category === CATEGORIES.USER) {
    moduleType = 'life-management';
  } else if (category === CATEGORIES.SETTINGS) {
    moduleType = 'core-wrapper';
  }
  
  return { date, moduleType, subcategory };
}
