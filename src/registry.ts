import type { ReactNode } from 'react';

import type { SceneAccessoryKind } from './types';

export type RegistryEntry = { kind: SceneAccessoryKind; children: ReactNode };

const entries = new Map<string, RegistryEntry>();
const listeners = new Set<() => void>();

export function setEntry(id: string, entry: RegistryEntry) {
  entries.set(id, entry);
  listeners.forEach((listener) => listener());
}

export function deleteEntry(id: string) {
  if (entries.delete(id)) listeners.forEach((listener) => listener());
}

export function getEntry(id: string): RegistryEntry | undefined {
  return entries.get(id);
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
