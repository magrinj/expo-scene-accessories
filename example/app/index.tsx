import { Link } from 'expo-router';
import { isSceneAccessorySupported } from 'expo-scene-accessories';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {`cameraCapture supported: ${isSceneAccessorySupported('cameraCapture')}`}
      </Text>
      <Text style={styles.label}>
        {`externalNonInteractive supported: ${isSceneAccessorySupported('externalNonInteractive')}`}
      </Text>
      <Link href="/camera" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Camera Capture Accessory</Text>
        </Pressable>
      </Link>
      <Link href="/script" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Teleprompter (Expo Router group layout)</Text>
        </Pressable>
      </Link>
      <Link href="/external" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>External Non-Interactive Accessory</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, backgroundColor: '#000' },
  label: { color: '#aaa', fontSize: 14 },
  link: { padding: 16, borderRadius: 12, backgroundColor: '#1c1c1e' },
  linkText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
