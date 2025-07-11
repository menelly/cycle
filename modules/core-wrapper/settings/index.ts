/**
 * CORE WRAPPER - SETTINGS MODULE
 * 
 * Central export file for all settings functionality
 * including visual settings, AI settings, localization, data management, etc.
 */

// Settings components
export { default as SettingsPage } from './page';
// export { default as VisualSettingsModal } from './visual-settings-modal';
// export { default as AISettingsModal } from './ai-settings-modal';
// export { default as LocalizationModal } from './localization-modal';
// export { default as DataManagementModal } from './data-management-modal';
// export { default as NotificationsModal } from './notifications-modal';
// export { default as TagsModal } from './tags-modal';
// export { default as SupportModal } from './support-modal';

// ============================================================================
// SETTINGS TYPES
// ============================================================================

export interface AppSettings {
  // Visual settings
  theme: string;
  font: string;
  goblinMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  
  // AI settings
  aiEnabled: boolean;
  aiPersonality: 'addy' | 'nam';
  aiAutoStart: boolean;
  aiModelPath?: string;
  
  // Localization
  locale: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  units: 'metric' | 'imperial';
  
  // Data management
  dataPin?: string;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  
  // Notifications
  notificationsEnabled: boolean;
  medicationReminders: boolean;
  appointmentReminders: boolean;
  
  // Privacy
  analyticsOptIn: boolean;
  crashReportingOptIn: boolean;
  medicalDataEncryption: boolean;
}

export interface SettingsCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  component: React.ComponentType<SettingsModalProps>;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
}

export interface SettingsActions {
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  exportSettings: () => Promise<string>;
  importSettings: (settingsJson: string) => Promise<void>;
}

// ============================================================================
// SETTINGS UTILITIES
// ============================================================================

/**
 * Get default settings
 */
export function getDefaultSettings(): AppSettings {
  return {
    // Visual settings
    theme: 'theme-lavender',
    font: 'font-atkinson',
    goblinMode: true,
    highContrast: false,
    reducedMotion: false,
    
    // AI settings
    aiEnabled: true,
    aiPersonality: 'addy',
    aiAutoStart: false,
    
    // Localization
    locale: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    units: 'imperial',
    
    // Data management
    autoBackup: false,
    backupFrequency: 'weekly',
    
    // Notifications
    notificationsEnabled: true,
    medicationReminders: true,
    appointmentReminders: true,
    
    // Privacy
    analyticsOptIn: false,
    crashReportingOptIn: false,
    medicalDataEncryption: true
  };
}

/**
 * Load settings from localStorage
 */
export function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem('chaos-app-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...getDefaultSettings(), ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return getDefaultSettings();
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem('chaos-app-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * Apply theme settings to the document
 */
export function applyThemeSettings(theme: string, font: string): void {
  // Remove existing theme classes
  const themes = [
    'theme-lavender', 'theme-chaos', 'theme-colorblind', 
    'theme-glitter', 'theme-control', 'theme-accessibility'
  ];
  themes.forEach(t => document.body.classList.remove(t));
  
  // Remove existing font classes
  const fonts = [
    'font-atkinson', 'font-comic', 'font-dyslexic', 
    'font-mono', 'font-serif', 'font-sans'
  ];
  fonts.forEach(f => document.body.classList.remove(f));
  
  // Apply new theme and font
  if (theme !== 'theme-lavender') {
    document.body.classList.add(theme);
  }
  document.body.classList.add(font);
}

/**
 * Validate settings object
 */
export function validateSettings(settings: Partial<AppSettings>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate theme
  if (settings.theme && !AVAILABLE_THEMES.includes(settings.theme)) {
    errors.push(`Invalid theme: ${settings.theme}`);
  }
  
  // Validate font
  if (settings.font && !AVAILABLE_FONTS.includes(settings.font)) {
    errors.push(`Invalid font: ${settings.font}`);
  }
  
  // Validate locale
  if (settings.locale && !AVAILABLE_LOCALES.includes(settings.locale)) {
    errors.push(`Invalid locale: ${settings.locale}`);
  }
  
  // Validate AI personality
  if (settings.aiPersonality && !['addy', 'nam'].includes(settings.aiPersonality)) {
    errors.push(`Invalid AI personality: ${settings.aiPersonality}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Export settings as JSON string
 */
export function exportSettingsAsJson(settings: AppSettings): string {
  return JSON.stringify(settings, null, 2);
}

/**
 * Import settings from JSON string
 */
export function importSettingsFromJson(json: string): AppSettings {
  try {
    const parsed = JSON.parse(json);
    const validation = validateSettings(parsed);
    
    if (!validation.isValid) {
      throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
    }
    
    return { ...getDefaultSettings(), ...parsed };
  } catch (error) {
    throw new Error(`Failed to import settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// SETTINGS CONSTANTS
// ============================================================================

export const AVAILABLE_THEMES = [
  'theme-lavender',
  'theme-chaos',
  'theme-colorblind',
  'theme-glitter',
  'theme-control',
  'theme-accessibility'
] as const;

export const AVAILABLE_FONTS = [
  'font-atkinson',
  'font-comic',
  'font-dyslexic',
  'font-mono',
  'font-serif',
  'font-sans'
] as const;

export const AVAILABLE_LOCALES = [
  'en-US',
  'es-ES',
  'fr-FR',
  'de-DE'
] as const;

export const THEME_DESCRIPTIONS = {
  'theme-lavender': 'Soft lavender and purple tones (default)',
  'theme-chaos': 'Vibrant chaos energy with rainbow accents',
  'theme-colorblind': 'High contrast colors for colorblind users',
  'theme-glitter': 'Sparkly and magical with glitter effects',
  'theme-control': 'Clean and minimal for focus',
  'theme-accessibility': 'Maximum accessibility and readability'
} as const;

export const FONT_DESCRIPTIONS = {
  'font-atkinson': 'Atkinson Hyperlegible (default)',
  'font-comic': 'Comic Sans MS (dyslexia-friendly)',
  'font-dyslexic': 'OpenDyslexic (specialized for dyslexia)',
  'font-mono': 'Monospace (coding style)',
  'font-serif': 'Times New Roman (traditional)',
  'font-sans': 'Arial (clean and simple)'
} as const;

export const SETTINGS_STORAGE_KEYS = {
  APP_SETTINGS: 'chaos-app-settings',
  THEME: 'chaos-theme',
  FONT: 'chaos-font',
  GOBLIN_MODE: 'chaos-goblin-mode',
  DATA_PIN: 'chaos-data-pin'
} as const;
