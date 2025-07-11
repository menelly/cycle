/**
 * CORE WRAPPER - NAVIGATION MODULE
 * 
 * Central export file for all navigation functionality
 * including sidebar, routing, and module navigation.
 */

// Core navigation components
export { default as AppSidebar } from './app-sidebar';

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface SidebarItem {
  id: string;
  text: string;
  emoji: string;
  targetPageId: string;
  isVisible: boolean;
  buttonClass: string;
  moduleType?: 'trackers' | 'life-management' | 'core-wrapper';
  category?: string;
}

export interface NavigationState {
  currentModule: 'trackers' | 'life-management' | 'core-wrapper' | null;
  currentPage: string | null;
  sidebarOpen: boolean;
  isMobile: boolean;
}

export interface ModuleRoute {
  path: string;
  module: 'trackers' | 'life-management' | 'core-wrapper';
  component: string;
  title: string;
  icon?: string;
  requiresAuth?: boolean;
}

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

/**
 * Main sidebar navigation items organized by module
 */
export const SIDEBAR_ITEMS: SidebarItem[] = [
  // Trackers Module
  {
    id: "body",
    text: "Body",
    emoji: "🫀",
    targetPageId: "body",
    isVisible: true,
    buttonClass: "sidebar-btn-1",
    moduleType: "trackers",
    category: "health"
  },
  {
    id: "mind",
    text: "Mind",
    emoji: "🧠",
    targetPageId: "mind",
    isVisible: true,
    buttonClass: "sidebar-btn-5",
    moduleType: "trackers",
    category: "health"
  },
  {
    id: "choice",
    text: "Choice",
    emoji: "💪",
    targetPageId: "choice",
    isVisible: true,
    buttonClass: "sidebar-btn-3",
    moduleType: "trackers",
    category: "health"
  },
  {
    id: "journal",
    text: "Journal",
    emoji: "📝",
    targetPageId: "journal",
    isVisible: true,
    buttonClass: "sidebar-btn-2",
    moduleType: "trackers",
    category: "health"
  },
  
  // Life Management Module
  {
    id: "planning",
    text: "Plan",
    emoji: "📅",
    targetPageId: "planning",
    isVisible: true,
    buttonClass: "sidebar-btn-2",
    moduleType: "life-management",
    category: "management"
  },
  {
    id: "manage",
    text: "Manage",
    emoji: "📋",
    targetPageId: "manage",
    isVisible: true,
    buttonClass: "sidebar-btn-4",
    moduleType: "life-management",
    category: "management"
  },
  {
    id: "patterns",
    text: "Patterns",
    emoji: "📊",
    targetPageId: "patterns",
    isVisible: true,
    buttonClass: "sidebar-btn-6",
    moduleType: "life-management",
    category: "analytics"
  },
  
  // Core Wrapper Module
  {
    id: "guide",
    text: "Guide",
    emoji: "🧭",
    targetPageId: "guide",
    isVisible: true,
    buttonClass: "sidebar-btn-guide",
    moduleType: "core-wrapper",
    category: "help"
  }
];

/**
 * Module routes configuration
 */
export const MODULE_ROUTES: ModuleRoute[] = [
  // Trackers Module Routes
  { path: '/body', module: 'trackers', component: 'BodyTracker', title: 'Body Tracking', icon: '🫀' },
  { path: '/mind', module: 'trackers', component: 'MindTracker', title: 'Mind Tracking', icon: '🧠' },
  { path: '/choice', module: 'trackers', component: 'ChoiceTracker', title: 'Choice Tracking', icon: '💪' },
  { path: '/journal', module: 'trackers', component: 'Journal', title: 'Journal', icon: '📝' },
  { path: '/forge', module: 'trackers', component: 'Forge', title: 'Tracker Builder', icon: '🔨' },
  
  // Life Management Module Routes
  { path: '/planning', module: 'life-management', component: 'Planning', title: 'Planning', icon: '📅' },
  { path: '/manage', module: 'life-management', component: 'Manage', title: 'Management', icon: '📋' },
  { path: '/patterns', module: 'life-management', component: 'Patterns', title: 'Patterns', icon: '📊' },
  
  // Core Wrapper Module Routes
  { path: '/guide', module: 'core-wrapper', component: 'Guide', title: 'Guide', icon: '🧭' },
  { path: '/settings', module: 'core-wrapper', component: 'Settings', title: 'Settings', icon: '⚙️' },
  { path: '/calendar', module: 'core-wrapper', component: 'Calendar', title: 'Calendar', icon: '📅' }
];

// ============================================================================
// NAVIGATION UTILITIES
// ============================================================================

/**
 * Get sidebar items by module type
 */
export function getSidebarItemsByModule(moduleType: 'trackers' | 'life-management' | 'core-wrapper'): SidebarItem[] {
  return SIDEBAR_ITEMS.filter(item => item.moduleType === moduleType);
}

/**
 * Get sidebar items by category
 */
export function getSidebarItemsByCategory(category: string): SidebarItem[] {
  return SIDEBAR_ITEMS.filter(item => item.category === category);
}

/**
 * Find sidebar item by ID
 */
export function findSidebarItem(id: string): SidebarItem | undefined {
  return SIDEBAR_ITEMS.find(item => item.id === id);
}

/**
 * Get module route by path
 */
export function getModuleRoute(path: string): ModuleRoute | undefined {
  return MODULE_ROUTES.find(route => route.path === path);
}

/**
 * Get routes by module
 */
export function getRoutesByModule(moduleType: 'trackers' | 'life-management' | 'core-wrapper'): ModuleRoute[] {
  return MODULE_ROUTES.filter(route => route.module === moduleType);
}

/**
 * Generate href for a page
 */
export function generateHref(pageId: string): string {
  const item = findSidebarItem(pageId);
  if (!item) return '/';
  
  const route = MODULE_ROUTES.find(r => r.component.toLowerCase().includes(pageId.toLowerCase()));
  return route?.path || `/${pageId}`;
}

/**
 * Get home href based on current context
 */
export function getHomeHref(): string {
  return '/';
}

/**
 * Check if current path matches a module
 */
export function isCurrentModule(path: string, moduleType: 'trackers' | 'life-management' | 'core-wrapper'): boolean {
  const route = getModuleRoute(path);
  return route?.module === moduleType;
}

/**
 * Get breadcrumb trail for current path
 */
export function getBreadcrumbs(path: string): Array<{ label: string; href: string }> {
  const route = getModuleRoute(path);
  if (!route) return [{ label: 'Home', href: '/' }];
  
  const breadcrumbs = [{ label: 'Home', href: '/' }];
  
  // Add module breadcrumb
  const moduleLabel = route.module === 'trackers' ? 'Health Tracking' :
                     route.module === 'life-management' ? 'Life Management' :
                     'Settings';
  breadcrumbs.push({ label: moduleLabel, href: `/${route.module}` });
  
  // Add current page
  if (route.path !== `/${route.module}`) {
    breadcrumbs.push({ label: route.title, href: route.path });
  }
  
  return breadcrumbs;
}

// ============================================================================
// NAVIGATION CONSTANTS
// ============================================================================

export const NAVIGATION_CONSTANTS = {
  SIDEBAR_WIDTH: {
    DESKTOP: '180px',
    MOBILE: '180px',
    COLLAPSED: '60px'
  },
  BREAKPOINTS: {
    MOBILE: 768
  },
  ANIMATION_DURATION: 200
} as const;
