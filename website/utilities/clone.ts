'use client';

export function cloneObject<T>(obj: T): T {
  if (typeof window !== 'undefined' && typeof window.structuredClone === 'function') {
    return window.structuredClone(obj);
  }

  return JSON.parse(JSON.stringify(obj)) as T;
}
