/**
 * CORE WRAPPER - AUTHENTICATION MODULE
 * 
 * Central export file for all authentication functionality
 * including PIN-based multi-user system and app wrapper.
 */

// Core authentication components
export { default as PinLogin } from './pin-login';
export { AppWrapper } from './app-wrapper';

// Authentication contexts
export { UserProvider, useUser } from './contexts/user-context';
export { AIProvider } from './contexts/ai-context';
export { PDFProvider, usePDFMode } from './contexts/pdf-context';

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthUser {
  pin: string;
  isLoggedIn: boolean;
  loginTime?: string;
  lastActivity?: string;
}

export interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (pin: string) => Promise<void>;
  logout: () => void;
  switchUser: () => void;
  updateLastActivity: () => void;
}

// ============================================================================
// AUTHENTICATION UTILITIES
// ============================================================================

/**
 * Validate PIN format and requirements
 */
export function validatePin(pin: string): { isValid: boolean; error?: string } {
  if (!pin || !pin.trim()) {
    return { isValid: false, error: 'PIN is required' };
  }
  
  if (pin.length < 4) {
    return { isValid: false, error: 'PIN must be at least 4 characters' };
  }
  
  if (pin.length > 20) {
    return { isValid: false, error: 'PIN must be 20 characters or less' };
  }
  
  return { isValid: true };
}

/**
 * Generate a masked PIN for logging (security)
 */
export function maskPin(pin: string): string {
  return pin.replace(/./g, '*');
}

/**
 * Check if user session is still valid
 */
export function isSessionValid(): boolean {
  const savedPin = localStorage.getItem('currentUserPin');
  const savedLoginState = localStorage.getItem('isLoggedIn');
  const lastActivity = localStorage.getItem('lastActivity');
  
  if (!savedPin || savedLoginState !== 'true') {
    return false;
  }
  
  // Check if session has expired (24 hours)
  if (lastActivity) {
    const lastActivityTime = new Date(lastActivity);
    const now = new Date();
    const hoursSinceActivity = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceActivity > 24) {
      return false;
    }
  }
  
  return true;
}

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  localStorage.setItem('lastActivity', new Date().toISOString());
}

/**
 * Clear authentication session
 */
export function clearAuthSession(): void {
  localStorage.removeItem('currentUserPin');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('lastActivity');
}

/**
 * Get current user PIN from session
 */
export function getCurrentUserPin(): string | null {
  if (!isSessionValid()) {
    return null;
  }
  return localStorage.getItem('currentUserPin');
}

// ============================================================================
// AUTHENTICATION CONSTANTS
// ============================================================================

export const AUTH_CONSTANTS = {
  MIN_PIN_LENGTH: 4,
  MAX_PIN_LENGTH: 20,
  SESSION_TIMEOUT_HOURS: 24,
  STORAGE_KEYS: {
    USER_PIN: 'currentUserPin',
    IS_LOGGED_IN: 'isLoggedIn',
    LAST_ACTIVITY: 'lastActivity'
  }
} as const;

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

/**
 * Hook for authentication state management
 */
export function useAuth() {
  // This would be implemented to provide auth state
  // For now, we'll use the existing useUser hook
  return {
    // Will be implemented when we refactor the auth system
  };
}
