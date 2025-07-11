/**
 * CORE WRAPPER MODULE
 * 
 * Central export file for the core application wrapper
 * including authentication, navigation, calendar, settings, and home.
 */

// Authentication exports
export * from './auth';

// Navigation exports
export * from './navigation';

// Calendar exports
export * from './calendar';

// Settings exports
export * from './settings';

// Home exports
export * from './home';

// ============================================================================
// CORE WRAPPER TYPES
// ============================================================================

export interface CoreWrapperConfig {
  enableAuth: boolean;
  enableNavigation: boolean;
  enableCalendar: boolean;
  enableSettings: boolean;
  defaultModule: 'trackers' | 'life-management' | 'core-wrapper';
  theme: string;
  locale: string;
}

export interface AppState {
  isInitialized: boolean;
  currentUser: any;
  currentModule: string;
  currentPage: string;
  sidebarOpen: boolean;
  theme: string;
  locale: string;
}

// ============================================================================
// CORE WRAPPER UTILITIES
// ============================================================================

/**
 * Initialize the core wrapper with configuration
 */
export function initializeCoreWrapper(config: Partial<CoreWrapperConfig> = {}): CoreWrapperConfig {
  const defaultConfig: CoreWrapperConfig = {
    enableAuth: true,
    enableNavigation: true,
    enableCalendar: true,
    enableSettings: true,
    defaultModule: 'trackers',
    theme: 'theme-lavender',
    locale: 'en-US'
  };
  
  return { ...defaultConfig, ...config };
}

/**
 * Get the current app state
 */
export function getAppState(): AppState {
  // This would be implemented with proper state management
  return {
    isInitialized: false,
    currentUser: null,
    currentModule: 'trackers',
    currentPage: 'home',
    sidebarOpen: true,
    theme: 'theme-lavender',
    locale: 'en-US'
  };
}

// ============================================================================
// CORE WRAPPER CONSTANTS
// ============================================================================

export const CORE_WRAPPER_CONSTANTS = {
  APP_NAME: 'Chaos Command Center',
  APP_DESCRIPTION: 'Executive Function for Chaotic Humans',
  VERSION: '1.0.0',
  MODULES: {
    TRACKERS: 'trackers',
    LIFE_MANAGEMENT: 'life-management',
    CORE_WRAPPER: 'core-wrapper'
  },
  THEMES: [
    'theme-lavender',
    'theme-chaos',
    'theme-colorblind',
    'theme-glitter',
    'theme-control',
    'theme-accessibility'
  ],
  LOCALES: [
    'en-US',
    'es-ES',
    'fr-FR',
    'de-DE'
  ]
} as const;

// ============================================================================
// MODULE INTEGRATION
// ============================================================================

/**
 * Register a module with the core wrapper
 */
export interface ModuleRegistration {
  name: string;
  version: string;
  routes: Array<{
    path: string;
    component: React.ComponentType;
    title: string;
  }>;
  sidebarItems?: Array<{
    id: string;
    label: string;
    icon: string;
    path: string;
  }>;
  dependencies?: string[];
}

/**
 * Module registry for dynamic loading
 */
export class ModuleRegistry {
  private modules = new Map<string, ModuleRegistration>();
  
  register(module: ModuleRegistration): void {
    this.modules.set(module.name, module);
  }
  
  get(name: string): ModuleRegistration | undefined {
    return this.modules.get(name);
  }
  
  getAll(): ModuleRegistration[] {
    return Array.from(this.modules.values());
  }
  
  isRegistered(name: string): boolean {
    return this.modules.has(name);
  }
}

// Global module registry instance
export const moduleRegistry = new ModuleRegistry();

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class CoreWrapperError extends Error {
  constructor(
    message: string,
    public code: string,
    public module?: string
  ) {
    super(message);
    this.name = 'CoreWrapperError';
  }
}

export const ERROR_CODES = {
  AUTH_FAILED: 'AUTH_FAILED',
  MODULE_NOT_FOUND: 'MODULE_NOT_FOUND',
  NAVIGATION_ERROR: 'NAVIGATION_ERROR',
  INITIALIZATION_ERROR: 'INITIALIZATION_ERROR'
} as const;
