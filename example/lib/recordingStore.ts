import { useSyncExternalStore } from 'react';

// A tiny external store: both the main screen and the accessory root read it, because React
// context does not cross into accessory content. Zustand, Jotai or Legend-State work the same way.
type RecordingState = { page: number; countdown: number | null };

let state: RecordingState = { page: 0, countdown: null };
const listeners = new Set<() => void>();

export function setRecordingState(patch: Partial<RecordingState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export function useRecordingState() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state
  );
}

export const SCRIPT = [
  'Welcome back to the channel. Today we are filming with the outer display.',
  'The teleprompter lives on the accessory scene, rendered by the same JavaScript runtime.',
  'Tap Next on the outer display, or on the main screen: both update the same store.',
  'That is a wrap. Thanks for watching!',
];
