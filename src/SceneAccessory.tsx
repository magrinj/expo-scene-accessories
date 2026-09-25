import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { AnchorView, isSceneAccessorySupported } from './ExpoSceneAccessoriesModule';
import { createAccessoryId } from './ids';
import { deleteEntry, setEntry } from './registry';
import type { SceneAccessoryKind, SceneAccessoryProps } from './types';

const warnedKinds = new Set<SceneAccessoryKind>();

function warnUnsupportedOnce(kind: SceneAccessoryKind) {
  if (!__DEV__ || Platform.OS !== 'ios' || !AnchorView || warnedKinds.has(kind)) return;
  warnedKinds.add(kind);
  console.warn(
    `[expo-scene-accessories] ${kind} accessories are not supported on this iOS version; nothing will be rendered.`
  );
}

export function SceneAccessory({
  kind,
  enabled = true,
  onAvailabilityChange,
  children,
}: SceneAccessoryProps & { kind: SceneAccessoryKind }) {
  const [id] = useState(createAccessoryId);

  // Written after commit so the accessory root never renders uncommitted children.
  useEffect(() => {
    setEntry(id, { kind, children });
  }, [id, kind, children]);
  useEffect(() => () => deleteEntry(id), [id]);

  if (!AnchorView || !isSceneAccessorySupported(kind)) {
    warnUnsupportedOnce(kind);
    return null;
  }

  return (
    <AnchorView
      accessoryId={id}
      kind={kind}
      enabled={enabled}
      onAvailabilityChange={(event) => onAvailabilityChange?.(event.nativeEvent.available)}
      style={styles.anchor}
    />
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'absolute', width: 0, height: 0 },
});
