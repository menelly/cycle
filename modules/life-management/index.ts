/**
 * LIFE MANAGEMENT MODULE
 * 
 * Central export file for all life management functionality
 * including planning, management, and pattern analysis.
 */

// Plan exports
export * from './plan';

// Manage exports  
export * from './manage';

// Patterns exports
export * from './patterns';

// ============================================================================
// LIFE MANAGEMENT TYPES
// ============================================================================

export interface LifeManagementItem {
  id: string;
  name: string;
  category: 'plan' | 'manage' | 'patterns';
  description: string;
  shortDescription: string;
  helpContent: string;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon' | 'planned';
  subItems?: SubItem[];
}

export interface SubItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface PlanningItem extends LifeManagementItem {
  category: 'plan';
  planningType: 'schedule' | 'tasks' | 'meals' | 'notes' | 'zone';
}

export interface ManagementItem extends LifeManagementItem {
  category: 'manage';
  managementType: 'medical' | 'household' | 'work' | 'documents' | 'providers';
}

export interface PatternItem extends LifeManagementItem {
  category: 'patterns';
  patternType: 'correlations' | 'analytics' | 'reports' | 'insights';
}

// ============================================================================
// PLANNING ITEMS
// ============================================================================

export const PLANNING_ITEMS: PlanningItem[] = [
  {
    id: 'weekly-planner',
    name: 'Weekly Planner',
    category: 'plan',
    planningType: 'schedule',
    description: '7-day overview with tasks and navigation',
    shortDescription: '7-day overview with tasks and navigation',
    helpContent: 'Weekly view with arrow navigation through weeks. Dynamically generated when needed. Integrates with daily schedule and task management for complete weekly planning.',
    icon: '📅',
    status: 'coming-soon'
  },
  {
    id: 'daily-schedule',
    name: 'Daily Schedule',
    category: 'plan',
    planningType: 'schedule',
    description: 'Hourly time blocks with integrated mini-trackers',
    shortDescription: 'Hourly time blocks with integrated mini-trackers',
    helpContent: 'Hourly time blocking with integrated small trackers like hydration, energy battery, and other quick-check items. Choose between schedule-only, task-list-only, or combined view.',
    icon: '🕐',
    status: 'coming-soon'
  },
  {
    id: 'task-lists',
    name: 'Task Lists',
    category: 'plan',
    planningType: 'tasks',
    description: 'To-dos with priorities and due dates',
    shortDescription: 'To-dos with priorities and due dates',
    helpContent: 'Flexible task management with priorities, due dates, and project organization. Integrates with daily schedule - choose task-only view, schedule-only view, or combined planning.',
    icon: '✅',
    status: 'coming-soon'
  },
  {
    id: 'meal-planning',
    name: 'Meal Planning',
    category: 'plan',
    planningType: 'meals',
    description: 'Plan meals and generate grocery lists',
    shortDescription: 'Plan meals and generate grocery lists',
    helpContent: 'Comprehensive meal planning with gremlin meal types, optional macro tracking, food photos, and gentle reminders. Includes meal planning and grocery integration.',
    icon: '🍽️',
    status: 'coming-soon',
    subItems: [
      { id: 'meal-tracking', name: 'Meal Tracking', icon: '🍽️' },
      { id: 'grocery-lists', name: 'Grocery Lists', icon: '🛒' },
      { id: 'meal-planning', name: 'Meal Planning', icon: '📋' }
    ]
  },
  {
    id: 'notes-sections',
    name: 'Notes & Freeform Text',
    category: 'plan',
    planningType: 'notes',
    description: 'Flexible note-taking areas',
    shortDescription: 'Flexible note-taking areas',
    helpContent: 'Freeform text areas for thoughts, ideas, and notes. Attach to specific days, projects, or keep as standalone notes. Perfect for brain dumps and quick captures.',
    icon: '📝',
    status: 'coming-soon'
  },
  {
    id: 'command-zone',
    name: 'Command Zone',
    category: 'plan',
    planningType: 'zone',
    description: 'Gamified quest log and dopamine management',
    shortDescription: 'Gamified quest log and dopamine management',
    helpContent: 'Transform daily tasks into quests with locations, rewards, and dopamine-driven mechanics. Perfect for ADHD brains that need gamification to stay motivated.',
    icon: '🎮',
    status: 'planned'
  }
];

// ============================================================================
// MANAGEMENT ITEMS
// ============================================================================

export const MANAGEMENT_ITEMS: ManagementItem[] = [
  {
    id: 'medications',
    name: 'Medications & Supplements',
    category: 'manage',
    managementType: 'medical',
    description: 'Dosing schedules, refill reminders, pharmacy contacts, side effects',
    shortDescription: 'Dosing schedules, refill reminders, pharmacy contacts, side effects',
    helpContent: 'Track all your medications and supplements with dosing schedules, refill reminders, pharmacy contacts, and side effect monitoring. Essential for medication management and medical appointments.',
    icon: '💊',
    status: 'available'
  },
  {
    id: 'providers',
    name: 'Healthcare Providers',
    category: 'manage',
    managementType: 'providers',
    description: 'Doctor contacts, specialties, appointment history, notes',
    shortDescription: 'Doctor contacts, specialties, appointment history, notes',
    helpContent: 'Comprehensive provider management with contact information, specialties, appointment history, and personal notes. Never forget which doctor said what or when your last appointment was.',
    icon: '👩‍⚕️',
    status: 'available'
  },
  {
    id: 'demographics',
    name: 'Demographics & Insurance',
    category: 'manage',
    managementType: 'medical',
    description: 'Personal info, insurance cards, emergency contacts',
    shortDescription: 'Personal info, insurance cards, emergency contacts',
    helpContent: 'Store all your essential information in one place - insurance cards, emergency contacts, allergies, and medical IDs. Perfect for appointments and emergencies.',
    icon: '📋',
    status: 'coming-soon'
  },
  {
    id: 'timeline',
    name: 'Medical Timeline',
    category: 'manage',
    managementType: 'medical',
    description: 'Chronological health history with major events and trends',
    shortDescription: 'Chronological health history with major events and trends',
    helpContent: 'Visual timeline of your health journey with major events, diagnoses, treatments, and symptom patterns. Essential for understanding your health story and sharing with providers.',
    icon: '📈',
    status: 'coming-soon'
  },
  {
    id: 'appointments',
    name: 'Appointments',
    category: 'manage',
    managementType: 'medical',
    description: 'Schedule, prep notes, follow-ups, and appointment summaries',
    shortDescription: 'Schedule, prep notes, follow-ups, and appointment summaries',
    helpContent: 'Complete appointment management with scheduling, preparation notes, follow-up reminders, and post-appointment summaries. Never forget what you wanted to ask or what the doctor said.',
    icon: '📅',
    status: 'coming-soon'
  },
  {
    id: 'medical-history',
    name: 'Medical History',
    category: 'manage',
    managementType: 'medical',
    description: 'Past procedures, surgeries, major events with document uploads',
    shortDescription: 'Past procedures, surgeries, major events with document uploads',
    helpContent: 'Comprehensive medical history tracking with timeline integration. Upload and store record scans, insurance cards, and important documents.',
    icon: '📄',
    status: 'coming-soon',
    subItems: [
      { id: 'procedures', name: 'Procedures & Surgeries', icon: '🏥' },
      { id: 'document-uploads', name: 'Document Uploads', icon: '📄' },
      { id: 'insurance-cards', name: 'Insurance Cards', icon: '💳' }
    ]
  },
  {
    id: 'chore-chart',
    name: 'Chore Chart & Adulting',
    category: 'manage',
    managementType: 'household',
    description: 'Household tasks with "normal people" guidance and reminders',
    shortDescription: 'Household tasks with "normal people" guidance and reminders',
    helpContent: 'Household task management with built-in guidance for neurodivergent folks who weren\'t taught basic adulting skills. Includes default schedules and optional reminders.',
    icon: '🏠',
    status: 'coming-soon',
    subItems: [
      { id: 'task-tracking', name: 'Task Tracking', icon: '✅' },
      { id: 'adulting-guidance', name: 'Adulting Guidance', icon: '📚' },
      { id: 'reminder-system', name: 'Gentle Reminders', icon: '🔔' },
      { id: 'routine-building', name: 'Routine Building', icon: '🔄' }
    ]
  },
  {
    id: 'missed-work',
    name: 'Missed Work & Disability',
    category: 'manage',
    managementType: 'work',
    description: 'FMLA, accommodations, disability applications',
    shortDescription: 'FMLA, accommodations, disability applications',
    helpContent: 'Comprehensive work and disability tracking including missed work days, FMLA usage, accommodation requests, and disability application progress.',
    icon: '💼',
    status: 'coming-soon',
    subItems: [
      { id: 'missed-days', name: 'Missed Work Days', icon: '📅' },
      { id: 'fmla-tracking', name: 'FMLA Tracking', icon: '📋' },
      { id: 'accommodations', name: 'Accommodations', icon: '♿' },
      { id: 'disability-apps', name: 'Disability Applications', icon: '📝' }
    ]
  }
];

// ============================================================================
// PATTERN ANALYSIS ITEMS
// ============================================================================

export const PATTERN_ITEMS: PatternItem[] = [
  {
    id: 'correlations',
    name: 'Health Correlations',
    category: 'patterns',
    patternType: 'correlations',
    description: 'Find connections between symptoms, triggers, and treatments',
    shortDescription: 'Find connections between symptoms, triggers, and treatments',
    helpContent: 'Advanced correlation analysis to identify patterns between different health metrics, environmental factors, and lifestyle choices.',
    icon: '🔗',
    status: 'available'
  },
  {
    id: 'analytics',
    name: 'Data Analytics',
    category: 'patterns',
    patternType: 'analytics',
    description: 'Visual charts and trend analysis of your health data',
    shortDescription: 'Visual charts and trend analysis of your health data',
    helpContent: 'Comprehensive analytics dashboard with charts, trends, and insights from your tracked health data.',
    icon: '📊',
    status: 'available'
  },
  {
    id: 'reports',
    name: 'Medical Reports',
    category: 'patterns',
    patternType: 'reports',
    description: 'Generate reports for doctors and insurance',
    shortDescription: 'Generate reports for doctors and insurance',
    helpContent: 'Generate professional medical reports and summaries for healthcare providers, insurance companies, and disability applications.',
    icon: '📋',
    status: 'coming-soon'
  },
  {
    id: 'insights',
    name: 'AI Insights',
    category: 'patterns',
    patternType: 'insights',
    description: 'AI-powered insights and recommendations',
    shortDescription: 'AI-powered insights and recommendations',
    helpContent: 'AI-powered analysis of your health data to provide personalized insights, recommendations, and pattern recognition.',
    icon: '🤖',
    status: 'planned'
  }
];

// ============================================================================
// LIFE MANAGEMENT UTILITIES
// ============================================================================

/**
 * Get all items by category
 */
export function getItemsByCategory(category: 'plan' | 'manage' | 'patterns'): LifeManagementItem[] {
  switch (category) {
    case 'plan':
      return PLANNING_ITEMS;
    case 'manage':
      return MANAGEMENT_ITEMS;
    case 'patterns':
      return PATTERN_ITEMS;
    default:
      return [];
  }
}

/**
 * Get all available items
 */
export function getAvailableItems(): LifeManagementItem[] {
  return [...PLANNING_ITEMS, ...MANAGEMENT_ITEMS, ...PATTERN_ITEMS].filter(
    item => item.status === 'available'
  );
}

/**
 * Find item by ID
 */
export function findItem(id: string): LifeManagementItem | undefined {
  return [...PLANNING_ITEMS, ...MANAGEMENT_ITEMS, ...PATTERN_ITEMS].find(
    item => item.id === id
  );
}

/**
 * Get item route
 */
export function getItemRoute(itemId: string): string {
  const item = findItem(itemId);
  if (!item) return '/';
  
  return `/${item.category}/${itemId}`;
}
