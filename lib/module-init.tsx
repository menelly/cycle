/**
 * MODULE INITIALIZATION
 * 
 * Initialize all modules when the app starts and provide
 * a React component to handle the initialization process.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { initializeModules } from './module-integration';

// UI components
import { Card, CardContent } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton'; // We don't have skeleton component

// ============================================================================
// INITIALIZATION TYPES
// ============================================================================

export interface ModuleInitState {
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  progress: number;
  currentStep: string;
}

export interface ModuleInitProviderProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ state: ModuleInitState }>;
  onInitialized?: () => void;
  onError?: (error: string) => void;
}

// ============================================================================
// INITIALIZATION LOADING COMPONENT
// ============================================================================

const DefaultInitializationFallback: React.FC<{ state: ModuleInitState }> = ({ state }) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          {/* Logo/Icon */}
          <div className="text-4xl">🎭</div>
          
          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-foreground">Chaos Command Center</h1>
            <p className="text-sm text-muted-foreground">Executive Function for Chaotic Humans</p>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {state.currentStep}
            </p>
          </div>

          {/* Loading animation */}
          {state.isInitializing && (
            <div className="space-y-2">
              <div className="h-4 w-3/4 mx-auto bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 mx-auto bg-muted rounded animate-pulse" />
            </div>
          )}

          {/* Error state */}
          {state.error && (
            <div className="text-destructive text-sm">
              <p className="font-medium">Initialization Error</p>
              <p className="mt-1">{state.error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ============================================================================
// MODULE INITIALIZATION HOOK
// ============================================================================

export function useModuleInitialization(): ModuleInitState & {
  initialize: () => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<ModuleInitState>({
    isInitialized: false,
    isInitializing: false,
    error: null,
    progress: 0,
    currentStep: 'Preparing...'
  });

  const initialize = async () => {
    setState(prev => ({
      ...prev,
      isInitializing: true,
      error: null,
      progress: 0,
      currentStep: 'Initializing modules...'
    }));

    try {
      // Step 1: Initialize shared resources
      setState(prev => ({ ...prev, progress: 20, currentStep: 'Loading shared resources...' }));
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading

      // Step 2: Initialize core wrapper modules
      setState(prev => ({ ...prev, progress: 40, currentStep: 'Loading core modules...' }));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 3: Initialize tracker modules
      setState(prev => ({ ...prev, progress: 60, currentStep: 'Loading health trackers...' }));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 4: Initialize life management modules
      setState(prev => ({ ...prev, progress: 80, currentStep: 'Loading life management...' }));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 5: Complete initialization
      setState(prev => ({ ...prev, progress: 90, currentStep: 'Finalizing...' }));
      await initializeModules();

      setState(prev => ({
        ...prev,
        progress: 100,
        currentStep: 'Ready!',
        isInitialized: true,
        isInitializing: false
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: errorMessage,
        currentStep: 'Initialization failed'
      }));
    }
  };

  const reset = () => {
    setState({
      isInitialized: false,
      isInitializing: false,
      error: null,
      progress: 0,
      currentStep: 'Preparing...'
    });
  };

  return {
    ...state,
    initialize,
    reset
  };
}

// ============================================================================
// MODULE INITIALIZATION PROVIDER
// ============================================================================

export const ModuleInitProvider: React.FC<ModuleInitProviderProps> = ({
  children,
  fallback: CustomFallback,
  onInitialized,
  onError
}) => {
  const { isInitialized, initialize, ...state } = useModuleInitialization();

  // Initialize modules on mount
  useEffect(() => {
    initialize();
  }, []);

  // Notify parent components
  useEffect(() => {
    if (isInitialized && onInitialized) {
      onInitialized();
    }
  }, [isInitialized, onInitialized]);

  useEffect(() => {
    if (state.error && onError) {
      onError(state.error);
    }
  }, [state.error, onError]);

  // Show loading/error state until initialized
  if (!isInitialized) {
    const FallbackComponent = CustomFallback || DefaultInitializationFallback;
    return <FallbackComponent state={{ isInitialized, ...state }} />;
  }

  // Render children once initialized
  return <>{children}</>;
};

// ============================================================================
// INITIALIZATION UTILITIES
// ============================================================================

/**
 * Check if modules are initialized
 */
export function areModulesInitialized(): boolean {
  // Simple check - could be more sophisticated
  return typeof window !== 'undefined' && 
         window.localStorage.getItem('modules-initialized') === 'true';
}

/**
 * Mark modules as initialized
 */
export function markModulesInitialized(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('modules-initialized', 'true');
  }
}

/**
 * Clear initialization state
 */
export function clearInitializationState(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('modules-initialized');
  }
}

// ============================================================================
// INITIALIZATION CONTEXT
// ============================================================================

export interface ModuleInitContextValue {
  isInitialized: boolean;
  reinitialize: () => Promise<void>;
  clearState: () => void;
}

export const ModuleInitContext = React.createContext<ModuleInitContextValue | null>(null);

export function useModuleInit(): ModuleInitContextValue {
  const context = React.useContext(ModuleInitContext);
  if (!context) {
    throw new Error('useModuleInit must be used within a ModuleInitProvider');
  }
  return context;
}

// ============================================================================
// HIGHER-ORDER COMPONENT
// ============================================================================

export function withModuleInit<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function ModuleInitWrapper(props: P) {
    return (
      <ModuleInitProvider>
        <Component {...props} />
      </ModuleInitProvider>
    );
  };
}
