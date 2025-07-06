/**
 * DATABASE INITIALIZATION HOOK
 * 
 * Main hook for initializing and managing the Dexie database.
 * Use this in your app root to ensure database is ready.
 */

import { useState, useEffect } from 'react';
import { initializeDatabase, db } from '../dexie-db';

export interface UseDatabaseReturn {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  retryInitialization: () => Promise<void>;
}

export function useDatabase(): UseDatabaseReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start as false - only show loading after delay
  const [error, setError] = useState<string | null>(null);

  const initDB = async () => {
    try {
      setError(null);
      console.log('🎯 DATABASE: Starting initialization...');

      // Only show loading state if it takes longer than 3 seconds
      const loadingTimeout = setTimeout(() => {
        setIsLoading(true);
      }, 3000);

      // Shorter timeout and simpler initialization
      const initPromise = initializeDatabase();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database initialization timeout (10s)')), 10000)
      );

      await Promise.race([initPromise, timeoutPromise]);

      // Clear the loading timeout since we finished
      clearTimeout(loadingTimeout);

      setIsInitialized(true);
      console.log('🎯 DATABASE: Successfully initialized');

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Database initialization failed';
      setError(errorMsg);
      console.error('💥 DATABASE: Initialization failed:', err);

      // Try to set initialized anyway to unblock the app
      console.log('🔧 DATABASE: Setting initialized despite error to unblock app');
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initDB();
  }, []);

  const retryInitialization = async () => {
    await initDB();
  };

  return {
    isInitialized,
    isLoading,
    error,
    retryInitialization
  };
}
