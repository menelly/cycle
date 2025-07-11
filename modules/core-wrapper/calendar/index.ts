/**
 * CORE WRAPPER - CALENDAR MODULE
 * 
 * Central export file for all calendar functionality
 * including monthly view, daily view, weekly view, and calendar utilities.
 */

// Calendar components (pages will be converted to components)
// export { default as MonthlyCalendar } from './page';
// export { default as DailyCalendar } from './day/[date]/page';
// export { default as WeeklyCalendar } from './week/[week]/page';

// ============================================================================
// CALENDAR TYPES
// ============================================================================

export interface CalendarDay {
  date: number | null;
  isCurrentMonth: boolean;
  isToday: boolean;
  content: string;
  events?: CalendarEvent[];
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  color?: string;
  category?: 'health' | 'appointment' | 'medication' | 'reminder' | 'custom';
  description?: string;
  isAllDay?: boolean;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: 'month' | 'week' | 'day';
  events: CalendarEvent[];
  isLoading: boolean;
}

export interface CalendarActions {
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  setViewMode: (mode: 'month' | 'week' | 'day') => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loadEvents: (startDate: Date, endDate: Date) => Promise<void>;
}

// ============================================================================
// CALENDAR UTILITIES
// ============================================================================

/**
 * Generate calendar data for a specific month
 */
export function generateCalendarMonth(date: Date): CalendarWeek[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Get first day of month and how many days in month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
  
  // Get today for comparison
  const today = new Date();
  
  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];
  let weekNumber = 1;
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    currentWeek.push({
      date: null,
      isCurrentMonth: false,
      isToday: false,
      content: ''
    });
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isToday = currentDate.toDateString() === today.toDateString();
    
    currentWeek.push({
      date: day,
      isCurrentMonth: true,
      isToday,
      content: ''
    });
    
    // If we've filled a week (7 days), start a new week
    if (currentWeek.length === 7) {
      weeks.push({
        weekNumber,
        days: currentWeek
      });
      currentWeek = [];
      weekNumber++;
    }
  }
  
  // Fill the last week with empty cells if needed
  while (currentWeek.length < 7) {
    currentWeek.push({
      date: null,
      isCurrentMonth: false,
      isToday: false,
      content: ''
    });
  }
  
  if (currentWeek.length > 0) {
    weeks.push({
      weekNumber,
      days: currentWeek
    });
  }
  
  return weeks;
}

/**
 * Generate calendar data for a specific week
 */
export function generateCalendarWeek(date: Date): CalendarDay[] {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay()); // Start on Sunday
  
  const week: CalendarDay[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    
    const isToday = currentDate.toDateString() === today.toDateString();
    const isCurrentMonth = currentDate.getMonth() === date.getMonth();
    
    week.push({
      date: currentDate.getDate(),
      isCurrentMonth,
      isToday,
      content: ''
    });
  }
  
  return week;
}

/**
 * Format date for URL routing
 */
export function formatDateForUrl(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Parse date from URL parameter
 */
export function parseDateFromUrl(dateString: string): Date {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
}

/**
 * Get week number of the year
 */
export function getWeekOfYear(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Generate navigation URLs
 */
export function generateCalendarUrls(date: Date) {
  const dateString = formatDateForUrl(date);
  const weekNumber = getWeekOfYear(date);
  
  return {
    day: `/calendar/day/${dateString}`,
    week: `/calendar/week/${weekNumber}`,
    month: `/calendar`
  };
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Get the start and end of a month
 */
export function getMonthBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
}

/**
 * Get the start and end of a week
 */
export function getWeekBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start on Sunday
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // End on Saturday
  
  return { start, end };
}

// ============================================================================
// CALENDAR CONSTANTS
// ============================================================================

export const CALENDAR_CONSTANTS = {
  DAYS_OF_WEEK: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  MONTHS: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  EVENT_CATEGORIES: {
    HEALTH: 'health',
    APPOINTMENT: 'appointment',
    MEDICATION: 'medication',
    REMINDER: 'reminder',
    CUSTOM: 'custom'
  },
  VIEW_MODES: {
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day'
  }
} as const;
