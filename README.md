<a href="https://www.linkedin.com/in/jeremy-magrin/">
  <img src="https://raw.githubusercontent.com/magrinj/expo-scene-accessories/main/.github/assets/expo-scene-accessories-banner.jpg" alt="expo-scene-accessories" width="100%" />
</a>

# expo-scene-accessories

[![npm version](https://img.shields.io/npm/v/expo-scene-accessories.svg)](https://www.npmjs.com/package/expo-scene-accessories)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![platforms](https://img.shields.io/badge/platforms-iOS%2027%2B-brightgreen)
![CI](https://github.com/magrinj/expo-scene-accessories/actions/workflows/ci.yml/badge.svg)

**Scene Accessories for React Native and Expo.**

Render React Native UI on iPhone Duo's outer display and on connected displays, using Apple's native Scene Accessories API.

```tsx
<CameraCaptureAccessory>
  <Teleprompter />
</CameraCaptureAccessory>
```

<img src="https://raw.githubusercontent.com/magrinj/expo-scene-accessories/main/.github/assets/external-display.png" alt="An ExternalNonInteractiveAccessory rendering a React Native slide on a connected display" width="480" />

## Why this library?

- **Any React Native UI in the accessory.** Not a fixed title and icon: your own components, with state, animations and touch handling, rendered by the same React Native renderer as the rest of your app.
- **Native Scene Accessories, not screen management.** You declare supplementary UI; iOS decides if, when and where it appears. No screen enumeration, no manual windows, no `present()` / `dismiss()`.
- **Same JavaScript runtime.** Accessory content is a second React Native surface on your app's existing host: no second bundle, no second Hermes runtime, no serialization. A button on the outer display can call `setState` on your main screen.
- **Interactive `CameraCaptureAccessory`.** Teleprompters, countdowns and subject-facing controls on iPhone Duo while the camera UI stays on the main display.
- **External non-interactive displays.** `ExternalNonInteractiveAccessory` shows presentation slides, scores or dashboards on external and AirPlay displays.
- **Lifecycle handled for you.** Mounting the component declares the accessory, unmounting removes it, and navigation away unregisters it. Nothing to add to `AppDelegate`, `SceneDelegate` or `Info.plist`.

## Requirements

| Requirement | Version |
| --- | --- |
| Expo | SDK 58+ (development build; Expo Go is not supported) |
| Architecture | New Architecture |
| Xcode | 27.1+ |
| `CameraCaptureAccessory` | iOS 27.1+ (iPhone Duo) |
| `ExternalNonInteractiveAccessory` | iOS 27.0+ |

On Android, on the web and on older iOS versions, the components render nothing and `isSceneAccessorySupported()` returns `false`.

> Apple marks the Camera Capture Accessory API as beta. Expect changes before 1.0.

## Installation

```bash
npx expo install expo-scene-accessories@alpha
npx expo run:ios
```

Pre-releases are published under the `alpha` dist-tag. Development builds with `expo-dev-client` and apps using `expo-updates` are supported.

The package is also published as `@magrinj/expo-scene-accessories`, an alias that depends on and re-exports `expo-scene-accessories`. **Install only one of the two names.**

## Usage

### `CameraCaptureAccessory`

Interactive content the system may present while your app is in the foreground with an active camera capture session. On iPhone Duo, that is the outer display.

```tsx
import { CameraCaptureAccessory } from 'expo-scene-accessories';

export default function CameraScreen() {
  const [enabled, setEnabled] = useState(true);
  const [available, setAvailable] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} />

      <Text>Outer taps: {count}</Text>
      <Button
        title={enabled ? 'Disable accessory' : 'Enable accessory'}
        disabled={!available}
        onPress={() => setEnabled((v) => !v)}
      />

      <CameraCaptureAccessory enabled={enabled} onAvailabilityChange={setAvailable}>
        <Text>Hello from React Native.</Text>
        <Button title="Tap me" onPress={() => setCount((v) => v + 1)} />
      </CameraCaptureAccessory>
    </View>
  );
}
```

The library does not create or own the camera session. Use `expo-camera`, `react-native-vision-camera` or your own capture code. According to Apple, the accessory becomes available when the app is in the foreground, shows full-screen UI on the main display, and has an active capture session (recording is not required).

### `ExternalNonInteractiveAccessory`

Non-interactive content the system may present on a connected external or AirPlay display. Its content never receives touches.

```tsx
import { ExternalNonInteractiveAccessory } from 'expo-scene-accessories';

<ExternalNonInteractiveAccessory>
  <Slide index={index} />
</ExternalNonInteractiveAccessory>
```

## API

### Props (both components)

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `ReactNode` | Rendered in a separate React root on the accessory scene, in the same JS runtime. |
| `enabled` | `boolean` | Your intent to show the accessory. Defaults to `true`. It does not mean "visible". |
| `onAvailabilityChange` | `(available: boolean) => void` | Called with the current system availability once registered, then on every change. |

`enabled` maps to `UISceneAccessoryRegistration.isEnabled`: toggling it never re-registers the accessory. To run code when the accessory is actually on screen, use a `useEffect` inside `children`. Mounted accessory content means presented.

### `useSceneAccessory()`

Only callable inside accessory content. Returns the accessory scene's own geometry and state:

```ts
type SceneAccessoryContextValue = {
  id: string;
  kind: 'cameraCapture' | 'externalNonInteractive';
  size: { width: number; height: number };
  safeAreaInsets: { top: number; right: number; bottom: number; left: number };
  scale: number;
  activationState: 'active' | 'inactive' | 'background';
};
```

```tsx
function Teleprompter() {
  const { size, safeAreaInsets, activationState } = useSceneAccessory();
  return (
    <View style={{ flex: 1, paddingTop: safeAreaInsets.top }}>
      <Text style={{ fontSize: size.width / 14 }}>…</Text>
    </View>
  );
}
```

### `isSceneAccessorySupported(kind)`

Whether the platform and OS version provide the given accessory API. This is a capability check, not the current availability (use `onAvailabilityChange` for that).

```ts
isSceneAccessorySupported('cameraCapture'); // true on iOS 27.1+
```

## Things to know

- **React context does not cross into accessory content.** The content runs in its own React root, so providers above `<CameraCaptureAccessory>` are not visible inside it. Pass values as props, wrap the content in its own providers, or use an external store (Zustand, Jotai, Legend-State, `useSyncExternalStore`). Suspense and error boundaries also have to live inside `children`.
- **`Dimensions`, `useWindowDimensions` and `PixelRatio` describe the main window.** Inside accessory content, use `useSceneAccessory()`.
- **Accessory state resets when the scene reconnects.** Keep anything that must survive in the main tree or in a store.
- **Your app must work without the accessory.** The system decides when it appears, and on most devices it never will.

## Recipes

### One accessory for a whole Expo Router group

A group layout stays mounted while any of its screens is shown, so an accessory declared there spans the group and is unregistered when the user leaves it:

```tsx
// app/(recording)/_layout.tsx
export default function RecordingLayout() {
  const pathname = usePathname();
  return (
    <>
      <Stack />
      <CameraCaptureAccessory>
        {pathname.endsWith('/countdown') ? <Countdown /> : <Teleprompter />}
      </CameraCaptureAccessory>
    </>
  );
}
```

### Screens that stay mounted

Registration follows the native lifecycle of the screen that contains the accessory, so leaving a native-stack screen unregisters it. Navigators that keep screens mounted (tabs, JS stacks) keep the accessory registered. Gate it on focus:

```tsx
const isFocused = useIsFocused();

<CameraCaptureAccessory enabled={isFocused}>…</CameraCaptureAccessory>
```

## Example

The [example app](./example/app) contains the camera accessory, a teleprompter shared across an Expo Router group, and an external-display presentation.

## Support

If you find this library useful, consider supporting its development:

<a href="https://buymeacoffee.com/magrinj" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

## License

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://www.linkedin.com/in/jeremy-magrin/">Jérémy Magrin</a>
</p>
