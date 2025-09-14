import { useEffect, useState } from 'react';

type LayoutMode = 'mobile' | 'desktop';

export function useLayoutMode(): LayoutMode {
  const STORAGE_KEY = 'rb_layout_mode';
  const [mode, setMode] = useState<LayoutMode>('mobile');

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // Try to get saved layout mode from sessionStorage
    try {
      const savedMode = sessionStorage.getItem(STORAGE_KEY) as LayoutMode | null;
      if (savedMode === 'mobile' || savedMode === 'desktop') {
        setMode(savedMode);
        return;
      }
    } catch (error) {
      // sessionStorage might not be available, continue with detection
    }

    // Detect initial layout mode based on screen size
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const initialMode: LayoutMode = mediaQuery.matches ? 'desktop' : 'mobile';
    
    setMode(initialMode);
    
    // Save to sessionStorage for session persistence
    try {
      sessionStorage.setItem(STORAGE_KEY, initialMode);
    } catch (error) {
      // Ignore sessionStorage errors (private browsing, etc.)
    }
  }, []);

  return mode;
}