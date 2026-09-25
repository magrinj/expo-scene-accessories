import { createContext, useContext } from 'react';

import type { SceneAccessoryContextValue } from './types';

export const SceneAccessoryContext = createContext<SceneAccessoryContextValue | null>(null);

/**
 * Geometry and state of the accessory scene rendering this content.
 * Use it instead of `Dimensions` / `useWindowDimensions`, which describe the main window.
 * Only valid inside accessory content.
 */
export function useSceneAccessory(): SceneAccessoryContextValue {
  const value = useContext(SceneAccessoryContext);
  if (!value) {
    throw new Error(
      '[expo-scene-accessories] useSceneAccessory() must be called inside accessory content.'
    );
  }
  return value;
}
