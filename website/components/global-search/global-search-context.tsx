'use client';

import { createContext, useCallback, useContext, useRef, ReactNode } from 'react';
import { useDisclosure } from '@heroui/modal';

interface GlobalSearchContextType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
  registerNavigateCallback: (callback: () => void) => () => void;
  triggerNavigate: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | null>(null);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const navigateCallbacks = useRef<Set<() => void>>(new Set());

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
