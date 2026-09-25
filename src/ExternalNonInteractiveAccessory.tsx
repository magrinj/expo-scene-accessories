import { SceneAccessory } from './SceneAccessory';
import type { SceneAccessoryProps } from './types';

/**
 * Non-interactive content the system may present on a connected external or AirPlay display. iOS 27.0+.
 */
export function ExternalNonInteractiveAccessory(props: SceneAccessoryProps) {
  return <SceneAccessory kind="externalNonInteractive" {...props} />;
}
