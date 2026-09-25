import { Link, Stack, router } from 'expo-router';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

import { SCRIPT, setRecordingState, useRecordingState } from '../../lib/recordingStore';

export default function ScriptScreen() {
  const { page } = useRecordingState();
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Teleprompter',
          headerLeft: () => <Button title="Close" onPress={() => router.back()} />,
        }}
      />
      <View style={styles.panel}>
        <Text style={styles.label}>{`Page ${page + 1} / ${SCRIPT.length}`}</Text>
        <Text style={styles.text}>{SCRIPT[page]}</Text>
        <View style={styles.row}>
          <Button
            title="Previous"
            disabled={page === 0}
            onPress={() => setRecordingState({ page: page - 1 })}
          />
          <Button
            title="Next"
            disabled={page === SCRIPT.length - 1}
            onPress={() => setRecordingState({ page: page + 1 })}
          />
        </View>
        <Link href="/countdown" asChild>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>Countdown</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end', padding: 20 },
  panel: { gap: 12, padding: 16, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.7)' },
  label: { color: '#aaa', fontSize: 14 },
  text: { color: '#fff', fontSize: 18 },
  row: { flexDirection: 'row', gap: 16 },
  link: { padding: 14, borderRadius: 12, backgroundColor: '#1c1c1e' },
  linkText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
