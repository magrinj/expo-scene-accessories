import type { ReactNode } from 'react';

export type SceneAccessoryKind = 'cameraCapture' | 'externalNonInteractive';

export type SceneAccessoryProps = {
  /**
   * The app's intent to show the accessory. Defaults to `true`.
   * Maps to `UISceneAccessoryRegistration.isEnabled`; it does not mean the accessory is visible.
   */
  enabled?: boolean;
  /** Called with the current value once registered, then every time the system availability changes. */
  onAvailabilityChange?: (available: boolean) => void;
  /**
   * Rendered in a separate React root on the accessory scene, in the same JavaScript runtime.
   * React context from the parent tree does not cross into it.
   */
  children: ReactNode;
};

export type SceneAccessoryMetrics = {
  size: { width: number; height: number };
  safeAreaInsets: { top: number; right: number; bottom: number; left: number };
  scale: number;
  activationState: 'active' | 'inactive' | 'background';
};

export type SceneAccessoryContextValue = SceneAccessoryMetrics & {
  id: string;
  kind: SceneAccessoryKind;
};
