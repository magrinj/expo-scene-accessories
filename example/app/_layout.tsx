import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#000' },
        }}>
        <Stack.Screen name="index" options={{ title: 'Scene Accessories' }} />
        <Stack.Screen name="camera" options={{ title: 'Camera Capture' }} />
        <Stack.Screen name="external" options={{ title: 'External Display' }} />
        <Stack.Screen name="(recording)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
