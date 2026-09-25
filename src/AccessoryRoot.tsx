import { useEffect, useState, useSyncExternalStore } from 'react';
import { StyleSheet } from 'react-native';

import { MetricsView } from './ExpoSceneAccessoriesModule';
import { getEntry, subscribe } from './registry';
import type { SceneAccessoryMetrics } from './types';
import { SceneAccessoryContext } from './useSceneAccessory';

/** Root component of every accessory surface, mounted natively as `ExpoSceneAccessoryRoot`. */
export function AccessoryRoot({ accessoryId }: { accessoryId: string }) {
  const entry = useSyncExternalStore(subscribe, () => getEntry(accessoryId));
  const [metrics, setMetrics] = useState<SceneAccessoryMetrics | null>(null);

  // Only a missing entry at connection time is a problem; it also disappears during normal teardown.
  useEffect(() => {
    if (__DEV__ && !getEntry(accessoryId)) {
      console.warn(
        `[expo-scene-accessories] Accessory scene connected but no matching renderer exists for id ${accessoryId}.`
      );
    }
  }, [accessoryId]);

  if (!entry || !MetricsView) return null;

  return (
    <MetricsView
      style={StyleSheet.absoluteFill}
      onMetricsChange={(event) => setMetrics(event.nativeEvent)}>
      {/* Children wait for the accessory's own metrics so they never lay out with main-window values. */}
      {metrics && (
        <SceneAccessoryContext.Provider value={{ id: accessoryId, kind: entry.kind, ...metrics }}>
          {entry.children}
        </SceneAccessoryContext.Provider>
      )}
    </MetricsView>
  );
}
