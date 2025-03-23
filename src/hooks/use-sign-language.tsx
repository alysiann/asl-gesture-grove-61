
import { useEffect } from 'react';
import { initializePatches } from '@/utils/patchInitializer';

/**
 * Hook to initialize sign language support
 * This hook should be used in both the Recognize and Train pages
 */
export function useSignLanguage() {
  useEffect(() => {
    // Initialize patches for sign language support
    initializePatches();
  }, []);
  
  return;
}
