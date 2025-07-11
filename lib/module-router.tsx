/**
 * MODULE ROUTER SYSTEM
 * 
 * Dynamic routing system that loads modules on demand and handles
 * navigation between different module sections.
 */

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { moduleLoader, type ModuleConfig, type ModuleRoute } from './module-integration';

// Shared components for loading states
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

// ============================================================================
// ROUTER TYPES
// ============================================================================

export interface RouterState {
  currentModule: string | null;
  currentRoute: string | null;
  isLoading: boolean;
  error: string | null;
  availableRoutes: ModuleRoute[];
}

export interface ModuleRouterProps {
  children?: React.ReactNode;
  fallback?: React.ComponentType;
  onModuleChange?: (moduleId: string) => void;
  onRouteChange?: (route: string) => void;
}

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

const ModuleLoadingFallback: React.FC<{ moduleName?: string }> = ({ moduleName }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground">
            {moduleName ? `Loading ${moduleName}...` : 'Loading module...'}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const RouteErrorFallback: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Card className="w-full max-w-md border-destructive">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="text-destructive text-2xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-destructive">Module Load Error</h3>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ============================================================================
// MODULE ROUTER HOOK
// ============================================================================

export function useModuleRouter(): RouterState & {
  navigateToModule: (moduleId: string, route?: string) => void;
  refreshCurrentModule: () => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<RouterState>({
    currentModule: null,
    currentRoute: null,
    isLoading: false,
    error: null,
    availableRoutes: []
  });

  // Parse current route to determine module
  useEffect(() => {
    const parseCurrentRoute = () => {
      const segments = pathname.split('/').filter(Boolean);
      
      if (segments.length === 0) {
        // Root path - home module
        setState(prev => ({
          ...prev,
          currentModule: 'core-home',
          currentRoute: '/',
          availableRoutes: getAvailableRoutes()
        }));
        return;
      }

      // Find matching module based on route
      const allModules = moduleLoader.getAllModules();
      let matchedModule: ModuleConfig | null = null;
      let matchedRoute: ModuleRoute | null = null;

      for (const module of allModules) {
        for (const route of module.routes) {
          if (route.path === pathname || route.path.startsWith(`/${segments[0]}`)) {
            matchedModule = module;
            matchedRoute = route;
            break;
          }
        }
        if (matchedModule) break;
      }

      setState(prev => ({
        ...prev,
        currentModule: matchedModule?.id || null,
        currentRoute: pathname,
        availableRoutes: getAvailableRoutes(),
        error: matchedModule ? null : `No module found for route: ${pathname}`
      }));
    };

    parseCurrentRoute();
  }, [pathname]);

  const getAvailableRoutes = (): ModuleRoute[] => {
    const allModules = moduleLoader.getAllModules();
    return allModules.flatMap(module => module.routes);
  };

  const navigateToModule = (moduleId: string, route?: string) => {
    const module = moduleLoader.getModule(moduleId);
    if (!module) {
      setState(prev => ({ ...prev, error: `Module ${moduleId} not found` }));
      return;
    }

    const targetRoute = route || module.routes[0]?.path || '/';
    router.push(targetRoute);
  };

  const refreshCurrentModule = () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    // Force re-render by updating state
    setTimeout(() => {
      setState(prev => ({ ...prev, isLoading: false }));
    }, 100);
  };

  return {
    ...state,
    navigateToModule,
    refreshCurrentModule
  };
}

// ============================================================================
// MODULE ROUTER COMPONENT
// ============================================================================

export const ModuleRouter: React.FC<ModuleRouterProps> = ({
  children,
  fallback: CustomFallback,
  onModuleChange,
  onRouteChange
}) => {
  const { currentModule, currentRoute, isLoading, error } = useModuleRouter();
  const [retryCount, setRetryCount] = useState(0);

  // Notify parent components of changes
  useEffect(() => {
    if (currentModule && onModuleChange) {
      onModuleChange(currentModule);
    }
  }, [currentModule, onModuleChange]);

  useEffect(() => {
    if (currentRoute && onRouteChange) {
      onRouteChange(currentRoute);
    }
  }, [currentRoute, onRouteChange]);

  // Handle retry logic
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    window.location.reload(); // Simple retry - reload the page
  };

  // Show error state
  if (error) {
    return CustomFallback ? (
      <CustomFallback />
    ) : (
      <RouteErrorFallback error={error} onRetry={handleRetry} />
    );
  }

  // Show loading state
  if (isLoading) {
    const module = currentModule ? moduleLoader.getModule(currentModule) : null;
    return CustomFallback ? (
      <CustomFallback />
    ) : (
      <ModuleLoadingFallback moduleName={module?.name} />
    );
  }

  // Render children (the actual module content)
  return (
    <Suspense fallback={<ModuleLoadingFallback />}>
      {children}
    </Suspense>
  );
};

// ============================================================================
// DYNAMIC MODULE COMPONENT
// ============================================================================

export interface DynamicModuleProps {
  moduleId: string;
  route?: string;
  props?: Record<string, any>;
  fallback?: React.ComponentType;
}

export const DynamicModule: React.FC<DynamicModuleProps> = ({
  moduleId,
  route,
  props = {},
  fallback
}) => {
  const [ModuleComponent, setModuleComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        setError(null);

        const module = moduleLoader.getModule(moduleId);
        if (!module) {
          throw new Error(`Module ${moduleId} not found`);
        }

        // If module is lazy-loaded, load it now
        if (module.lazy) {
          await moduleLoader.registerModule(module);
        }

        setModuleComponent(() => module.component);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error(`Failed to load module ${moduleId}:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  if (loading) {
    const module = moduleLoader.getModule(moduleId);
    return fallback ? (
      React.createElement(fallback)
    ) : (
      <ModuleLoadingFallback moduleName={module?.name} />
    );
  }

  if (error) {
    return <RouteErrorFallback error={error} />;
  }

  if (!ModuleComponent) {
    return <RouteErrorFallback error={`Module component not found for ${moduleId}`} />;
  }

  return (
    <Suspense fallback={<ModuleLoadingFallback />}>
      <ModuleComponent {...props} />
    </Suspense>
  );
};

// ============================================================================
// ROUTE UTILITIES
// ============================================================================

/**
 * Get all available routes from loaded modules
 */
export function getAllRoutes(): ModuleRoute[] {
  const allModules = moduleLoader.getAllModules();
  return allModules.flatMap(module => module.routes);
}

/**
 * Find route by path
 */
export function findRouteByPath(path: string): ModuleRoute | null {
  const allRoutes = getAllRoutes();
  return allRoutes.find(route => route.path === path) || null;
}

/**
 * Get routes for a specific module
 */
export function getModuleRoutes(moduleId: string): ModuleRoute[] {
  const module = moduleLoader.getModule(moduleId);
  return module ? module.routes : [];
}

/**
 * Check if a route requires authentication
 */
export function routeRequiresAuth(path: string): boolean {
  const route = findRouteByPath(path);
  return route?.requiresAuth ?? true; // Default to requiring auth
}
