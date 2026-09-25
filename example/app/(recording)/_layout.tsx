import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, usePathname } from 'expo-router';
import { CameraCaptureAccessory, useSceneAccessory } from 'expo-scene-accessories';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';

import { SCRIPT, setRecordingState, useRecordingState } from '../../lib/recordingStore';

function TeleprompterAccessory() {
  const { page } = useRecordingState();
  const { safeAreaInsets, size } = useSceneAccessory();
  return (
    <View style={[styles.accessory, { paddingTop: safeAreaInsets.top + 16 }]}>
      <Text style={[styles.prompt, { fontSize: Math.max(20, size.width / 14) }]}>
        {SCRIPT[page]}
      </Text>
      <Button
        title="Next"
        disabled={page === SCRIPT.length - 1}
        onPress={() => setRecordingState({ page: page + 1 })}
      />
    </View>
  );
}

function CountdownAccessory() {
  const { countdown } = useRecordingState();
  return (
    <View style={styles.accessory}>
      <Text style={styles.countdown}>{countdown === null ? 'Ready' : countdown || 'Go!'}</Text>
    </View>
  );
}

// Declared once in the group layout, the accessory spans every screen of the group and is
// unregistered when the user leaves it. The content follows the current route.
export default function RecordingLayout() {
  const pathname = usePathname();
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <View style={styles.container}>
      {permission?.granted && <CameraView style={StyleSheet.absoluteFill} facing="front" />}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      {permission && !permission.granted && (
        <View style={styles.permission}>
          <Button
            title="Allow camera"
            onPress={permission.canAskAgain ? requestPermission : Linking.openSettings}
          />
        </View>
      )}
      <CameraCaptureAccessory>
        {pathname.endsWith('/countdown') ? <CountdownAccessory /> : <TeleprompterAccessory />}
      </CameraCaptureAccessory>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permission: { position: 'absolute', top: 120, alignSelf: 'center' },
  accessory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    backgroundColor: '#000',
  },
  prompt: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  countdown: { color: '#fff', fontSize: 120, fontWeight: '800' },
});
