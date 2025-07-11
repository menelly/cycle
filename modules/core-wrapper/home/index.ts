/**
 * CORE WRAPPER - HOME MODULE
 * 
 * Central export file for the home page functionality
 * including the main landing page and dashboard widgets.
 */

// Home components
export { default as HomePage } from './page';

// ============================================================================
// HOME TYPES
// ============================================================================

export interface HomeWidget {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<HomeWidgetProps>;
  category: 'health' | 'planning' | 'wellness' | 'fun' | 'quick-access';
  enabled: boolean;
  position?: {
    row: number;
    col: number;
    width: number;
    height: number;
  };
}

export interface HomeWidgetProps {
  widget: HomeWidget;
  onToggle?: (widgetId: string) => void;
  onConfigure?: (widgetId: string) => void;
}

export interface HomeState {
  widgets: HomeWidget[];
  enabledWidgets: string[];
  isLoading: boolean;
  error: string | null;
}

export interface HomeActions {
  toggleWidget: (widgetId: string) => void;
  reorderWidgets: (widgetIds: string[]) => void;
  resetWidgets: () => void;
  addCustomWidget: (widget: Omit<HomeWidget, 'id'>) => void;
  removeWidget: (widgetId: string) => void;
}

export interface QuickAccessItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  category: 'trackers' | 'life-management' | 'core-wrapper';
  description?: string;
}

// ============================================================================
// HOME UTILITIES
// ============================================================================

/**
 * Get default home widgets
 */
export function getDefaultHomeWidgets(): HomeWidget[] {
  return [
    {
      id: 'welcome',
      name: 'Welcome Message',
      description: 'Personalized welcome with motivational quotes',
      component: WelcomeWidget,
      category: 'wellness',
      enabled: true,
      position: { row: 0, col: 0, width: 2, height: 1 }
    },
    {
      id: 'quick-trackers',
      name: 'Quick Trackers',
      description: 'Fast access to most-used health trackers',
      component: QuickTrackersWidget,
      category: 'health',
      enabled: true,
      position: { row: 1, col: 0, width: 1, height: 2 }
    },
    {
      id: 'today-summary',
      name: 'Today Summary',
      description: 'Overview of today\'s tracked data',
      component: TodaySummaryWidget,
      category: 'health',
      enabled: true,
      position: { row: 1, col: 1, width: 1, height: 1 }
    },
    {
      id: 'upcoming-appointments',
      name: 'Upcoming Appointments',
      description: 'Next scheduled appointments and reminders',
      component: UpcomingAppointmentsWidget,
      category: 'planning',
      enabled: true,
      position: { row: 2, col: 1, width: 1, height: 1 }
    },
    {
      id: 'medication-reminders',
      name: 'Medication Reminders',
      description: 'Today\'s medication schedule',
      component: MedicationRemindersWidget,
      category: 'health',
      enabled: true,
      position: { row: 3, col: 0, width: 2, height: 1 }
    },
    {
      id: 'mood-check',
      name: 'Quick Mood Check',
      description: 'Fast mood and energy level tracking',
      component: MoodCheckWidget,
      category: 'wellness',
      enabled: false,
      position: { row: 4, col: 0, width: 1, height: 1 }
    },
    {
      id: 'survival-button',
      name: 'Survival Button',
      description: 'Emergency support and crisis resources',
      component: SurvivalButtonWidget,
      category: 'wellness',
      enabled: true,
      position: { row: 0, col: 2, width: 1, height: 1 }
    }
  ];
}

/**
 * Get quick access items for the home page
 */
export function getQuickAccessItems(): QuickAccessItem[] {
  return [
    // Trackers
    { id: 'body', label: 'Body', icon: '🫀', href: '/body', category: 'trackers', description: 'Physical health tracking' },
    { id: 'mind', label: 'Mind', icon: '🧠', href: '/mind', category: 'trackers', description: 'Mental health tracking' },
    { id: 'choice', label: 'Choice', icon: '💪', href: '/choice', category: 'trackers', description: 'Lifestyle choices tracking' },
    { id: 'journal', label: 'Journal', icon: '📝', href: '/journal', category: 'trackers', description: 'Daily journaling' },
    
    // Life Management
    { id: 'planning', label: 'Plan', icon: '📅', href: '/planning', category: 'life-management', description: 'Schedule and planning' },
    { id: 'manage', label: 'Manage', icon: '📋', href: '/manage', category: 'life-management', description: 'Life administration' },
    { id: 'patterns', label: 'Patterns', icon: '📊', href: '/patterns', category: 'life-management', description: 'Data analysis' },
    
    // Core Wrapper
    { id: 'calendar', label: 'Calendar', icon: '📅', href: '/calendar', category: 'core-wrapper', description: 'Calendar view' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings', category: 'core-wrapper', description: 'App settings' }
  ];
}

/**
 * Filter widgets by category
 */
export function getWidgetsByCategory(widgets: HomeWidget[], category: HomeWidget['category']): HomeWidget[] {
  return widgets.filter(widget => widget.category === category);
}

/**
 * Get enabled widgets
 */
export function getEnabledWidgets(widgets: HomeWidget[]): HomeWidget[] {
  return widgets.filter(widget => widget.enabled);
}

/**
 * Sort widgets by position
 */
export function sortWidgetsByPosition(widgets: HomeWidget[]): HomeWidget[] {
  return widgets.sort((a, b) => {
    if (!a.position || !b.position) return 0;
    if (a.position.row !== b.position.row) {
      return a.position.row - b.position.row;
    }
    return a.position.col - b.position.col;
  });
}

/**
 * Generate grid layout for widgets
 */
export function generateWidgetGrid(widgets: HomeWidget[]): HomeWidget[][] {
  const enabledWidgets = getEnabledWidgets(widgets);
  const sortedWidgets = sortWidgetsByPosition(enabledWidgets);
  
  const grid: HomeWidget[][] = [];
  let currentRow: HomeWidget[] = [];
  let currentRowIndex = 0;
  
  for (const widget of sortedWidgets) {
    if (widget.position && widget.position.row > currentRowIndex) {
      if (currentRow.length > 0) {
        grid.push(currentRow);
        currentRow = [];
      }
      currentRowIndex = widget.position.row;
    }
    currentRow.push(widget);
  }
  
  if (currentRow.length > 0) {
    grid.push(currentRow);
  }
  
  return grid;
}

// ============================================================================
// WIDGET COMPONENTS (Placeholder interfaces)
// ============================================================================

// These would be implemented as actual React components
export interface WelcomeWidget extends React.ComponentType<HomeWidgetProps> {}
export interface QuickTrackersWidget extends React.ComponentType<HomeWidgetProps> {}
export interface TodaySummaryWidget extends React.ComponentType<HomeWidgetProps> {}
export interface UpcomingAppointmentsWidget extends React.ComponentType<HomeWidgetProps> {}
export interface MedicationRemindersWidget extends React.ComponentType<HomeWidgetProps> {}
export interface MoodCheckWidget extends React.ComponentType<HomeWidgetProps> {}
export interface SurvivalButtonWidget extends React.ComponentType<HomeWidgetProps> {}

// ============================================================================
// HOME CONSTANTS
// ============================================================================

export const HOME_CONSTANTS = {
  WIDGET_CATEGORIES: {
    HEALTH: 'health',
    PLANNING: 'planning',
    WELLNESS: 'wellness',
    FUN: 'fun',
    QUICK_ACCESS: 'quick-access'
  },
  GRID_COLUMNS: 3,
  GRID_GAP: 16,
  WIDGET_MIN_HEIGHT: 200,
  WIDGET_MIN_WIDTH: 300
} as const;

export const MOTIVATIONAL_QUOTES = [
  "Your chaos is valid, your progress is real. 🌟",
  "Executive dysfunction is not a character flaw. 💜",
  "Small steps still count as movement. 🦶",
  "You're doing better than you think you are. ✨",
  "Chaos can be beautiful when it's yours. 🌪️",
  "Your brain works differently, not wrong. 🧠",
  "Progress isn't always linear, and that's okay. 📈",
  "You are worthy of care, especially from yourself. 💝",
  "Surviving is an achievement worth celebrating. 🎉",
  "Your struggles are valid, your victories matter. 🏆"
] as const;
