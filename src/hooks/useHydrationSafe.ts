"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to prevent hydration mismatch for client-only values
 */
export function useHydrationSafe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Hook to get current year in a hydration-safe way
 */
export function useCurrentYear() {
  const mounted = useHydrationSafe();
  
  // Return a static year for SSR, current year for client
  return mounted ? new Date().getFullYear() : 2024;
}