import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraCaptureAccessory, useSceneAccessory } from 'expo-scene-accessories';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

function AccessoryContent({ count, onTap }: { count: number; onTap: () => void }) {
  const { size, safeAreaInsets } = useSceneAccessory();
  return (
    <View style={[styles.accessory, { paddingTop: safeAreaInsets.top }]}>
      <Text style={styles.accessoryTitle}>Hello from React Native.</Text>
      <Text style={styles.accessoryText}>
        {`${Math.round(size.width)}×${Math.round(size.height)} · taps ${count}`}
      </Text>
      <Button title="Tap me" onPress={onTap} />
    </View>
  );
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [enabled, setEnabled] = useState(true);
  const [available, setAvailable] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      {permission?.granted ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      ) : (
        <Button title="Allow camera" onPress={requestPermission} />
      )}
      <View style={styles.panel}>
        <Text style={styles.label}>{`Available: ${available ? 'yes' : 'no'}`}</Text>
        <Text style={styles.label}>{`Outer taps: ${count}`}</Text>
        <Button
          title={enabled ? 'Disable accessory' : 'Enable accessory'}
          onPress={() => setEnabled((value) => !value)}
        />
      </View>
      <CameraCaptureAccessory enabled={enabled} onAvailabilityChange={setAvailable}>
        <AccessoryContent count={count} onTap={() => setCount((value) => value + 1)} />
      </CameraCaptureAccessory>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#000' },
  panel: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  label: { color: '#fff', fontSize: 16 },
  accessory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#111',
  },
  accessoryTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  accessoryText: { color: '#ccc', fontSize: 16 },
});
