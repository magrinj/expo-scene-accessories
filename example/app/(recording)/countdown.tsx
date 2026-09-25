import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { setRecordingState, useRecordingState } from '../../lib/recordingStore';

export default function CountdownScreen() {
  const { countdown } = useRecordingState();

  useEffect(() => {
    if (!countdown) return;
    const timer = setTimeout(() => setRecordingState({ countdown: countdown - 1 }), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => () => setRecordingState({ countdown: null }), []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Countdown' }} />
      <View style={styles.panel}>
        <Text style={styles.value}>{countdown === null ? 'Ready' : countdown || 'Go!'}</Text>
        <Button title="Start 3-2-1" onPress={() => setRecordingState({ countdown: 3 })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end', padding: 20 },
  panel: { gap: 12, padding: 16, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.7)' },
  value: { color: '#fff', fontSize: 48, fontWeight: '800', textAlign: 'center' },
});
