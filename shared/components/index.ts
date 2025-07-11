/**
 * SHARED COMPONENTS INDEX
 * 
 * Central export file for all shared UI components
 * used across the modular Command Center architecture.
 */

// Re-export all shadcn/ui components
export * from './ui/alert';
export * from './ui/badge';
export * from './ui/button';
export * from './ui/calendar';
export * from './ui/card';
export * from './ui/checkbox';
export * from './ui/dialog';
export * from './ui/input';
export * from './ui/keyboard-avoiding-wrapper';
export * from './ui/label';
export * from './ui/popover';
export * from './ui/progress';
export * from './ui/radio-group';
export * from './ui/select';
export * from './ui/separator';
export * from './ui/slider';
export * from './ui/switch';
export * from './ui/tabs';
export * from './ui/textarea';
export * from './ui/toast';
export * from './ui/toaster';
export * from './ui/tooltip';

// ============================================================================
// COMPONENT CATEGORIES
// ============================================================================

// UI Components (shadcn/ui based)
export const UI_COMPONENTS = [
  'Alert',
  'Badge', 
  'Button',
  'Calendar',
  'Card',
  'Checkbox',
  'Dialog',
  'Input',
  'KeyboardAvoidingWrapper',
  'Label',
  'Popover',
  'Progress',
  'RadioGroup',
  'Select',
  'Separator',
  'Slider',
  'Switch',
  'Tabs',
  'Textarea',
  'Toast',
  'Toaster',
  'Tooltip'
] as const;

// Form Components (to be added)
export const FORM_COMPONENTS = [
  'FormField',
  'FormLabel',
  'FormMessage',
  'FormControl',
  'FormDescription'
] as const;

// Layout Components (to be added)
export const LAYOUT_COMPONENTS = [
  'Container',
  'Grid',
  'Stack',
  'Spacer',
  'Divider'
] as const;

// Navigation Components (to be added)
export const NAVIGATION_COMPONENTS = [
  'Sidebar',
  'Navbar',
  'Breadcrumb',
  'Pagination',
  'Menu'
] as const;

// Data Display Components (to be added)
export const DATA_DISPLAY_COMPONENTS = [
  'Table',
  'List',
  'Avatar',
  'Image',
  'Icon'
] as const;

// Feedback Components (to be added)
export const FEEDBACK_COMPONENTS = [
  'Loading',
  'Spinner',
  'Skeleton',
  'EmptyState',
  'ErrorBoundary'
] as const;

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export type UIComponent = typeof UI_COMPONENTS[number];
export type FormComponent = typeof FORM_COMPONENTS[number];
export type LayoutComponent = typeof LAYOUT_COMPONENTS[number];
export type NavigationComponent = typeof NAVIGATION_COMPONENTS[number];
export type DataDisplayComponent = typeof DATA_DISPLAY_COMPONENTS[number];
export type FeedbackComponent = typeof FEEDBACK_COMPONENTS[number];

export type SharedComponent = 
  | UIComponent 
  | FormComponent 
  | LayoutComponent 
  | NavigationComponent 
  | DataDisplayComponent 
  | FeedbackComponent;

// ============================================================================
// COMPONENT UTILITIES
// ============================================================================

/**
 * Check if a component is available in the shared library
 */
export function isSharedComponent(componentName: string): componentName is SharedComponent {
  return [
    ...UI_COMPONENTS,
    ...FORM_COMPONENTS,
    ...LAYOUT_COMPONENTS,
    ...NAVIGATION_COMPONENTS,
    ...DATA_DISPLAY_COMPONENTS,
    ...FEEDBACK_COMPONENTS
  ].includes(componentName as any);
}

/**
 * Get all available shared components
 */
export function getAllSharedComponents(): SharedComponent[] {
  return [
    ...UI_COMPONENTS,
    ...FORM_COMPONENTS,
    ...LAYOUT_COMPONENTS,
    ...NAVIGATION_COMPONENTS,
    ...DATA_DISPLAY_COMPONENTS,
    ...FEEDBACK_COMPONENTS
  ];
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: 'ui' | 'form' | 'layout' | 'navigation' | 'data-display' | 'feedback'): readonly string[] {
  switch (category) {
    case 'ui':
      return UI_COMPONENTS;
    case 'form':
      return FORM_COMPONENTS;
    case 'layout':
      return LAYOUT_COMPONENTS;
    case 'navigation':
      return NAVIGATION_COMPONENTS;
    case 'data-display':
      return DATA_DISPLAY_COMPONENTS;
    case 'feedback':
      return FEEDBACK_COMPONENTS;
    default:
      return [];
  }
}
