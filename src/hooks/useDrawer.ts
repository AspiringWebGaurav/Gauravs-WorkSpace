'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface DrawerConfig {
  closeOnRouteChange?: boolean;
  closeOnEscape?: boolean;
  lockBodyScroll?: boolean;
}

interface DrawerState {
  isOpen: boolean;
  isAnimating: boolean;
}

export function useDrawer(config: DrawerConfig = {}) {
  const {
    closeOnRouteChange = true,
    closeOnEscape = true,
    lockBodyScroll = true
  } = config;

  const [state, setState] = useState<DrawerState>({
    isOpen: false,
    isAnimating: false
  });

  const pathname = usePathname();

  const open = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggle = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const setAnimating = useCallback((animating: boolean) => {
    setState(prev => ({ ...prev, isAnimating: animating }));
  }, []);

  // Close on route change
  useEffect(() => {
    if (closeOnRouteChange && state.isOpen) {
      close();
    }
  }, [pathname, closeOnRouteChange, state.isOpen, close]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, state.isOpen, close]);

  // Body scroll lock
  useEffect(() => {
    if (!lockBodyScroll) return;

    if (state.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isOpen, lockBodyScroll]);

  return {
    ...state,
    open,
    close,
    toggle,
    setAnimating
  };
}