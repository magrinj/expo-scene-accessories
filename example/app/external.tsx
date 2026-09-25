import { ExternalNonInteractiveAccessory, useSceneAccessory } from 'expo-scene-accessories';
import { useState } from 'react';
import { Button, StyleSheet, Switch, Text, View } from 'react-native';

const SLIDES = ['Scene Accessories', 'Same JS runtime', 'System-driven presentation'];

function Slide({ index }: { index: number }) {
  const { size } = useSceneAccessory();
  return (
    <View style={styles.slide}>
      <Text style={[styles.slideTitle, { fontSize: size.width / 16 }]}>{SLIDES[index]}</Text>
      <Text style={styles.slideFooter}>{`${index + 1} / ${SLIDES.length}`}</Text>
    </View>
  );
}

export default function ExternalScreen() {
  const [index, setIndex] = useState(0);
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{`Available: ${available ? 'yes' : 'no'}`}</Text>
      <Text style={styles.title}>{SLIDES[index]}</Text>
      <View style={styles.row}>
        <Button title="Previous" disabled={index === 0} onPress={() => setIndex((i) => i - 1)} />
        <Button
          title="Next"
          disabled={index === SLIDES.length - 1}
          onPress={() => setIndex((i) => i + 1)}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Show on external display</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>
      <ExternalNonInteractiveAccessory enabled={enabled} onAvailabilityChange={setAvailable}>
        <Slide index={index} />
      </ExternalNonInteractiveAccessory>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, backgroundColor: '#000' },
  label: { color: '#aaa', fontSize: 14 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a2540' },
  slideTitle: { color: '#fff', fontWeight: '800', textAlign: 'center' },
  slideFooter: { position: 'absolute', bottom: 16, color: '#9ab' },
});
