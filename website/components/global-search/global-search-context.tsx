'use client';

import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';

interface GlobalSearchContextType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  registerNavigateCallback: (callback: () => void) => () => void;
  triggerNavigate: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | null>(null);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigateCallbacks = useRef<Set<() => void>>(new Set());

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpenChange = useCallback((open: boolean) => setIsOpen(open), []);

  const registerNavigateCallback = useCallback((callback: () => void) => {
    navigateCallbacks.current.add(callback);
    return () => {
      navigateCallbacks.current.delete(callback);
    };
  }, []);

  const triggerNavigate = useCallback(() => {
    navigateCallbacks.current.forEach((callback) => callback());
  }, []);

  return (
    <GlobalSearchContext.Provider
      value={{ isOpen, onOpen, onClose, onOpenChange, registerNavigateCallback, triggerNavigate }}
    >
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error('useGlobalSearch must be used within a GlobalSearchProvider');
  }
  return context;
}
