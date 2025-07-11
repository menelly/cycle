/**
 * SHARED TYPES INDEX
 * 
 * Central export file for all shared TypeScript types and interfaces
 * used across the modular Command Center architecture.
 */

// Database types (from shared/database)
export type { 
  DailyDataRecord, 
  UserTag, 
  ImageBlob 
} from '../database/dexie-db';

// Parser types (from shared/types/parsers)
export type { 
  ParsedField, 
  ParseResult, 
  ParserPattern, 
  ParserConfig 
} from './parsers/types';

// Medication types (from shared/types/medication)
export type { 
  Medication,
  MedicationFormData,
  MedicationEntry,
  MedicationSearchResult,
  UseMedicationReturn,
  NewMedication,
  MedicationUpdate,
  MedicationValidationErrors
} from './medication/medication-types';

// ============================================================================
// COMMON SHARED TYPES
// ============================================================================

/**
 * Common modal props interface used across all modules
 */
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Common entry interface for all tracker types
 */
export interface BaseTrackerEntry {
  id: string;
  date: string;
  timestamp: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Common form data interface
 */
export interface BaseFormData {
  notes: string;
  tags: string[];
}

/**
 * Severity scale (1-10) used across multiple trackers
 */
export type SeverityScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Duration interface used across multiple trackers
 */
export interface Duration {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
}

/**
 * Theme types
 */
export type Theme = "light" | "dark" | "system" | "chaos" | "colorblind" | "glitter" | "control" | "accessibility";

/**
 * Module types for the microapp architecture
 */
export type ModuleType = 'trackers' | 'life-management' | 'core-wrapper';

/**
 * Tracker categories
 */
export type TrackerCategory = 'body' | 'mind' | 'choice' | 'journal' | 'forge';

/**
 * Life management categories
 */
export type LifeManagementCategory = 'plan' | 'manage' | 'patterns';

/**
 * Core wrapper categories
 */
export type CoreWrapperCategory = 'auth' | 'navigation' | 'calendar' | 'settings' | 'home';

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make all properties optional except specified ones
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Make all properties required except specified ones
 */
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

/**
 * Extract the value type from an array
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Create a type with string keys and any values (for flexible content)
 */
export type FlexibleContent = Record<string, any>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
