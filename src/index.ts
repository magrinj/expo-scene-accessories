import { AppRegistry } from 'react-native';

import { AccessoryRoot } from './AccessoryRoot';

AppRegistry.registerComponent('ExpoSceneAccessoryRoot', () => AccessoryRoot);

export { CameraCaptureAccessory } from './CameraCaptureAccessory';
export { ExternalNonInteractiveAccessory } from './ExternalNonInteractiveAccessory';
export { isSceneAccessorySupported } from './ExpoSceneAccessoriesModule';
export { useSceneAccessory } from './useSceneAccessory';
export type { SceneAccessoryContextValue, SceneAccessoryKind, SceneAccessoryProps } from './types';
