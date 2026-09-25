import { SceneAccessory } from './SceneAccessory';
import type { SceneAccessoryProps } from './types';

/**
 * Interactive content the system may present while the app is in the foreground with an active
 * camera capture session, e.g. on iPhone Duo's outer display. iOS 27.1+.
 */
export function CameraCaptureAccessory(props: SceneAccessoryProps) {
  return <SceneAccessory kind="cameraCapture" {...props} />;
}
