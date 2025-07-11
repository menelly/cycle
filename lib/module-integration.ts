/**
 * MODULE INTEGRATION SYSTEM
 * 
 * Central system for loading, managing, and coordinating all modules
 * in the Chaos Command Center modular architecture.
 */

import React from 'react';

// Import all module types and utilities
import type { 
  ModuleType, 
  TrackerCategory, 
  LifeManagementCategory, 
  CoreWrapperCategory 
} from '@/shared/types';

import { moduleRegistry, type ModuleRegistration } from '@/modules/core-wrapper';

// ============================================================================
// MODULE INTEGRATION TYPES
// ============================================================================

export interface ModuleConfig {
  id: string;
  name: string;
  type: ModuleType;
  category?: string;
  enabled: boolean;
  lazy?: boolean;
  dependencies?: string[];
  routes: ModuleRoute[];
  component: React.ComponentType<any>;
}

export interface ModuleRoute {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  icon?: string;
  requiresAuth?: boolean;
  preload?: boolean;
}

export interface ModuleContext {
  currentModule: string | null;
  currentRoute: string | null;
  moduleConfigs: Map<string, ModuleConfig>;
  sharedState: Record<string, any>;
  isLoading: boolean;
  error: string | null;
}

export interface ModuleActions {
  loadModule: (moduleId: string) => Promise<void>;
  unloadModule: (moduleId: string) => void;
  navigateToModule: (moduleId: string, route?: string) => void;
  updateSharedState: (key: string, value: any) => void;
  getSharedState: (key: string) => any;
}

// ============================================================================
// MODULE LOADER
// ============================================================================

export class ModuleLoader {
  private loadedModules = new Map<string, ModuleConfig>();
  private moduleComponents = new Map<string, React.ComponentType<any>>();
  private sharedState = new Map<string, any>();

  /**
   * Register a module with the loader
   */
  async registerModule(config: ModuleConfig): Promise<void> {
    try {
      // Validate dependencies
      if (config.dependencies) {
        for (const dep of config.dependencies) {
          if (!this.loadedModules.has(dep)) {
            throw new Error(`Module ${config.id} depends on ${dep} which is not loaded`);
          }
        }
      }

      // Load the module component if lazy loading
      if (config.lazy && !this.moduleComponents.has(config.id)) {
        const component = await this.loadModuleComponent(config);
        this.moduleComponents.set(config.id, component);
      }

      this.loadedModules.set(config.id, config);
      
      // Register with the global module registry
      moduleRegistry.register({
        name: config.name,
        version: '1.0.0',
        routes: config.routes.map(route => ({
          path: route.path,
          component: route.component,
          title: route.title
        })),
        dependencies: config.dependencies
      });

      console.log(`Module ${config.id} registered successfully`);
    } catch (error) {
      console.error(`Failed to register module ${config.id}:`, error);
      throw error;
    }
  }

  /**
   * Load a module component dynamically
   */
  private async loadModuleComponent(config: ModuleConfig): Promise<React.ComponentType<any>> {
    try {
      let moduleImport;
      
      switch (config.type) {
        case 'trackers':
          moduleImport = await import(`@/modules/trackers/${config.category}`);
          break;
        case 'life-management':
          moduleImport = await import(`@/modules/life-management/${config.category}`);
          break;
        case 'core-wrapper':
          moduleImport = await import(`@/modules/core-wrapper/${config.category}`);
          break;
        default:
          throw new Error(`Unknown module type: ${config.type}`);
      }

      return moduleImport.default || moduleImport[config.name];
    } catch (error) {
      console.error(`Failed to load module component for ${config.id}:`, error);
      throw error;
    }
  }

  /**
   * Get a loaded module
   */
  getModule(moduleId: string): ModuleConfig | undefined {
    return this.loadedModules.get(moduleId);
  }

  /**
   * Get all loaded modules
   */
  getAllModules(): ModuleConfig[] {
    return Array.from(this.loadedModules.values());
  }

  /**
   * Get modules by type
   */
  getModulesByType(type: ModuleType): ModuleConfig[] {
    return this.getAllModules().filter(module => module.type === type);
  }

  /**
   * Check if a module is loaded
   */
  isModuleLoaded(moduleId: string): boolean {
    return this.loadedModules.has(moduleId);
  }

  /**
   * Unload a module
   */
  unloadModule(moduleId: string): void {
    this.loadedModules.delete(moduleId);
    this.moduleComponents.delete(moduleId);
    console.log(`Module ${moduleId} unloaded`);
  }

  /**
   * Update shared state
   */
  updateSharedState(key: string, value: any): void {
    this.sharedState.set(key, value);
  }

  /**
   * Get shared state
   */
  getSharedState(key: string): any {
    return this.sharedState.get(key);
  }

  /**
   * Get all shared state
   */
  getAllSharedState(): Record<string, any> {
    return Object.fromEntries(this.sharedState);
  }
}

// ============================================================================
// MODULE CONFIGURATIONS
// ============================================================================

/**
 * Default module configurations
 */
export const DEFAULT_MODULE_CONFIGS: ModuleConfig[] = [
  // Core Wrapper Modules
  {
    id: 'core-auth',
    name: 'Authentication',
    type: 'core-wrapper',
    category: 'auth',
    enabled: true,
    lazy: false,
    routes: [
      { path: '/login', component: React.lazy(() => import('@/modules/core-wrapper/auth/pin-login')), title: 'Login' }
    ],
    component: React.lazy(() => import('@/modules/core-wrapper/auth'))
  },
  {
    id: 'core-navigation',
    name: 'Navigation',
    type: 'core-wrapper',
    category: 'navigation',
    enabled: true,
    lazy: false,
    dependencies: ['core-auth'],
    routes: [],
    component: React.lazy(() => import('@/modules/core-wrapper/navigation'))
  },
  {
    id: 'core-home',
    name: 'Home',
    type: 'core-wrapper',
    category: 'home',
    enabled: true,
    lazy: false,
    dependencies: ['core-auth', 'core-navigation'],
    routes: [
      { path: '/', component: React.lazy(() => import('@/modules/core-wrapper/home/page')), title: 'Home' }
    ],
    component: React.lazy(() => import('@/modules/core-wrapper/home'))
  },
  {
    id: 'core-calendar',
    name: 'Calendar',
    type: 'core-wrapper',
    category: 'calendar',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/calendar', component: React.lazy(() => import('@/modules/core-wrapper/calendar/page')), title: 'Calendar' }
    ],
    component: React.lazy(() => import('@/modules/core-wrapper/calendar'))
  },
  {
    id: 'core-settings',
    name: 'Settings',
    type: 'core-wrapper',
    category: 'settings',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/settings', component: React.lazy(() => import('@/modules/core-wrapper/settings/page')), title: 'Settings' }
    ],
    component: React.lazy(() => import('@/modules/core-wrapper/settings'))
  },

  // Tracker Modules
  {
    id: 'trackers-body',
    name: 'Body Trackers',
    type: 'trackers',
    category: 'body',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/body', component: React.lazy(() => import('@/modules/trackers/body/page')), title: 'Body Tracking' }
    ],
    component: React.lazy(() => import('@/modules/trackers/body'))
  },
  {
    id: 'trackers-mind',
    name: 'Mind Trackers',
    type: 'trackers',
    category: 'mind',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/mind', component: React.lazy(() => import('@/modules/trackers/mind/page')), title: 'Mind Tracking' }
    ],
    component: React.lazy(() => import('@/modules/trackers/mind'))
  },
  {
    id: 'trackers-choice',
    name: 'Choice Trackers',
    type: 'trackers',
    category: 'choice',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/choice', component: React.lazy(() => import('@/modules/trackers/choice/page')), title: 'Choice Tracking' }
    ],
    component: React.lazy(() => import('@/modules/trackers/choice'))
  },
  {
    id: 'trackers-journal',
    name: 'Journal',
    type: 'trackers',
    category: 'journal',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/journal', component: React.lazy(() => import('@/modules/trackers/journal/page')), title: 'Journal' }
    ],
    component: React.lazy(() => import('@/modules/trackers/journal'))
  },

  // Life Management Modules
  {
    id: 'life-plan',
    name: 'Planning',
    type: 'life-management',
    category: 'plan',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/planning', component: React.lazy(() => import('@/modules/life-management/plan/page')), title: 'Planning' }
    ],
    component: React.lazy(() => import('@/modules/life-management/plan'))
  },
  {
    id: 'life-manage',
    name: 'Management',
    type: 'life-management',
    category: 'manage',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/manage', component: React.lazy(() => import('@/modules/life-management/manage/page')), title: 'Management' }
    ],
    component: React.lazy(() => import('@/modules/life-management/manage'))
  },
  {
    id: 'life-patterns',
    name: 'Patterns',
    type: 'life-management',
    category: 'patterns',
    enabled: true,
    lazy: true,
    dependencies: ['core-auth'],
    routes: [
      { path: '/patterns', component: React.lazy(() => import('@/modules/life-management/patterns/page')), title: 'Patterns' }
    ],
    component: React.lazy(() => import('@/modules/life-management/patterns'))
  }
];

// ============================================================================
// GLOBAL MODULE LOADER INSTANCE
// ============================================================================

export const moduleLoader = new ModuleLoader();

/**
 * Initialize all default modules
 */
export async function initializeModules(): Promise<void> {
  console.log('Initializing modules...');
  
  try {
    // Sort modules by dependencies (core modules first)
    const sortedConfigs = [...DEFAULT_MODULE_CONFIGS].sort((a, b) => {
      if (a.type === 'core-wrapper' && b.type !== 'core-wrapper') return -1;
      if (b.type === 'core-wrapper' && a.type !== 'core-wrapper') return 1;
      return 0;
    });

    // Register modules in dependency order
    for (const config of sortedConfigs) {
      if (config.enabled) {
        await moduleLoader.registerModule(config);
      }
    }

    console.log('All modules initialized successfully');
  } catch (error) {
    console.error('Failed to initialize modules:', error);
    throw error;
  }
}
