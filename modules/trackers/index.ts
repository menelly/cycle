/**
 * TRACKERS MODULE
 * 
 * Central export file for all health tracking functionality
 * including body, mind, choice, journal, and forge (custom tracker builder).
 */

// Body tracker exports
// export * from './body';

// Mind tracker exports  
// export * from './mind';

// Choice tracker exports
// export * from './choice';

// Journal exports
export * from './journal';

// Forge (custom tracker builder) exports
// export * from './forge';

// Shared tracker exports
// export * from './shared';

// ============================================================================
// TRACKER TYPES
// ============================================================================

export interface BaseTracker {
  id: string;
  name: string;
  category: 'body' | 'mind' | 'choice' | 'journal' | 'forge';
  description: string;
  icon: string;
  status: 'available' | 'coming-soon' | 'planned';
  isPopular?: boolean;
  subTrackers?: SubTracker[];
}

export interface SubTracker {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface TrackerEntry {
  id: string;
  trackerId: string;
  date: string;
  timestamp: string;
  data: Record<string, any>;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TrackerConfig {
  id: string;
  name: string;
  fields: TrackerField[];
  validation?: TrackerValidation;
  analytics?: TrackerAnalytics;
}

export interface TrackerField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date' | 'time' | 'scale' | 'duration';
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
  helpText?: string;
}

export interface TrackerValidation {
  required?: string[];
  custom?: Array<{
    field: string;
    rule: string;
    message: string;
  }>;
}

export interface TrackerAnalytics {
  enabled: boolean;
  charts?: string[];
  correlations?: string[];
  insights?: string[];
}

// ============================================================================
// TRACKER CONSTANTS
// ============================================================================

export const TRACKER_CATEGORIES = {
  BODY: 'body',
  MIND: 'mind', 
  CHOICE: 'choice',
  JOURNAL: 'journal',
  FORGE: 'forge'
} as const;

export const TRACKER_STATUS = {
  AVAILABLE: 'available',
  COMING_SOON: 'coming-soon',
  PLANNED: 'planned'
} as const;

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  BOOLEAN: 'boolean',
  DATE: 'date',
  TIME: 'time',
  SCALE: 'scale',
  DURATION: 'duration'
} as const;

// ============================================================================
// BODY TRACKERS
// ============================================================================

export const BODY_TRACKERS: BaseTracker[] = [
  {
    id: 'pain',
    name: 'Pain',
    category: 'body',
    description: 'Track pain levels, locations, and triggers',
    icon: '🩹',
    status: 'available',
    isPopular: true
  },
  {
    id: 'head-pain',
    name: 'Head Pain',
    category: 'body',
    description: 'Specialized headache and migraine tracking',
    icon: '🤕',
    status: 'available'
  },
  {
    id: 'energy',
    name: 'Energy',
    category: 'body',
    description: 'Track energy levels throughout the day',
    icon: '🔋',
    status: 'available',
    isPopular: true
  },
  {
    id: 'sleep',
    name: 'Sleep',
    category: 'body',
    description: 'Sleep quality, duration, and patterns',
    icon: '😴',
    status: 'available',
    isPopular: true
  },
  {
    id: 'dysautonomia',
    name: 'Dysautonomia',
    category: 'body',
    description: 'Heart rate, blood pressure, and autonomic symptoms',
    icon: '💓',
    status: 'available'
  },
  {
    id: 'seizure',
    name: 'Seizure',
    category: 'body',
    description: 'Seizure tracking and triggers',
    icon: '⚡',
    status: 'available'
  },
  {
    id: 'diabetes',
    name: 'Diabetes',
    category: 'body',
    description: 'Blood glucose, insulin, and diabetes management',
    icon: '🩸',
    status: 'available'
  },
  {
    id: 'reproductive-health',
    name: 'Reproductive Health',
    category: 'body',
    description: 'Menstrual cycles, symptoms, and reproductive health',
    icon: '🌸',
    status: 'coming-soon'
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    category: 'body',
    description: 'Digestive health and bathroom habits',
    icon: '🚽',
    status: 'coming-soon'
  },
  {
    id: 'upper-digestive',
    name: 'Upper Digestive',
    category: 'body',
    description: 'Nausea, heartburn, and upper GI symptoms',
    icon: '🤢',
    status: 'available'
  },
  {
    id: 'other-symptoms',
    name: 'Other Symptoms',
    category: 'body',
    description: 'Custom symptom tracking for anything else',
    icon: '📝',
    status: 'available'
  }
];

// ============================================================================
// MIND TRACKERS
// ============================================================================

export const MIND_TRACKERS: BaseTracker[] = [
  {
    id: 'mood',
    name: 'Mood',
    category: 'mind',
    description: 'Track mood, emotions, and mental state',
    icon: '😊',
    status: 'available',
    isPopular: true
  },
  {
    id: 'brain-fog',
    name: 'Brain Fog',
    category: 'mind',
    description: 'Cognitive clarity and brain fog tracking',
    icon: '🌫️',
    status: 'available'
  },
  {
    id: 'anxiety',
    name: 'Anxiety',
    category: 'mind',
    description: 'Anxiety levels, triggers, and coping strategies',
    icon: '😰',
    status: 'available'
  },
  {
    id: 'panic',
    name: 'Panic',
    category: 'mind',
    description: 'Panic attacks and acute anxiety episodes',
    icon: '😱',
    status: 'available'
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    category: 'mind',
    description: 'General mental health and wellbeing',
    icon: '🧠',
    status: 'coming-soon'
  }
];

// ============================================================================
// CHOICE TRACKERS
// ============================================================================

export const CHOICE_TRACKERS: BaseTracker[] = [
  {
    id: 'food-choice',
    name: 'Food Choice',
    category: 'choice',
    description: 'Track meals, nutrition, and food choices',
    icon: '🍽️',
    status: 'available',
    isPopular: true
  },
  {
    id: 'food-allergens',
    name: 'Food Allergens',
    category: 'choice',
    description: 'Track food allergens and reactions',
    icon: '🚫',
    status: 'coming-soon'
  },
  {
    id: 'movement',
    name: 'Movement',
    category: 'choice',
    description: 'Physical activity and movement tracking',
    icon: '🏃',
    status: 'available'
  },
  {
    id: 'hydration',
    name: 'Hydration',
    category: 'choice',
    description: 'Water intake and hydration tracking',
    icon: '💧',
    status: 'coming-soon'
  },
  {
    id: 'weather-environment',
    name: 'Weather & Environment',
    category: 'choice',
    description: 'Environmental factors and weather tracking',
    icon: '🌤️',
    status: 'available'
  }
];

// ============================================================================
// TRACKER UTILITIES
// ============================================================================

/**
 * Get all trackers by category
 */
export function getTrackersByCategory(category: 'body' | 'mind' | 'choice'): BaseTracker[] {
  switch (category) {
    case 'body':
      return BODY_TRACKERS;
    case 'mind':
      return MIND_TRACKERS;
    case 'choice':
      return CHOICE_TRACKERS;
    default:
      return [];
  }
}

/**
 * Get all available trackers
 */
export function getAvailableTrackers(): BaseTracker[] {
  return [...BODY_TRACKERS, ...MIND_TRACKERS, ...CHOICE_TRACKERS].filter(
    tracker => tracker.status === 'available'
  );
}

/**
 * Get popular trackers
 */
export function getPopularTrackers(): BaseTracker[] {
  return [...BODY_TRACKERS, ...MIND_TRACKERS, ...CHOICE_TRACKERS].filter(
    tracker => tracker.isPopular
  );
}

/**
 * Find tracker by ID
 */
export function findTracker(id: string): BaseTracker | undefined {
  return [...BODY_TRACKERS, ...MIND_TRACKERS, ...CHOICE_TRACKERS].find(
    tracker => tracker.id === id
  );
}

/**
 * Get tracker route
 */
export function getTrackerRoute(trackerId: string): string {
  const tracker = findTracker(trackerId);
  if (!tracker) return '/';
  
  return `/${tracker.category}/${trackerId}`;
}
