import { requireNativeView, requireOptionalNativeModule } from 'expo';
import type { ComponentType, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { SceneAccessoryKind, SceneAccessoryMetrics } from './types';

type NativeModuleShape = { isSupported(kind: SceneAccessoryKind): boolean };

// ponytail: null on Android, web and Expo Go; every component downstream becomes a no-op.
const NativeModule = requireOptionalNativeModule<NativeModuleShape>('ExpoSceneAccessories');

/**
 * Whether this platform and OS version provide the given Scene Accessory API.
 * This is a capability check, not the current system availability.
 */
export function isSceneAccessorySupported(kind: SceneAccessoryKind): boolean {
  return NativeModule?.isSupported(kind) ?? false;
}

export type AnchorViewProps = {
  accessoryId: string;
  kind: SceneAccessoryKind;
  enabled: boolean;
  onAvailabilityChange: (event: { nativeEvent: { available: boolean } }) => void;
  style?: StyleProp<ViewStyle>;
};

export type MetricsViewProps = {
  onMetricsChange: (event: { nativeEvent: SceneAccessoryMetrics }) => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export const AnchorView: ComponentType<AnchorViewProps> | null = NativeModule
  ? requireNativeView('ExpoSceneAccessories', 'SceneAccessoryAnchorView')
  : null;

export const MetricsView: ComponentType<MetricsViewProps> | null = NativeModule
  ? requireNativeView('ExpoSceneAccessories', 'SceneAccessoryMetricsView')
  : null;
