import { Stack } from 'expo-router';

export default function ActivitiesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Activities' }} />
      <Stack.Screen name="running" options={{ title: 'Running' }} />
      <Stack.Screen name="long-jump" options={{ title: 'Long Jump' }} />
      <Stack.Screen name="sit-ups" options={{ title: 'Sit-ups' }} />
      <Stack.Screen name="push-ups" options={{ title: 'Push-ups' }} />
      <Stack.Screen name="high-jump" options={{ title: 'High Jump' }} />
      <Stack.Screen name="shuttle-run" options={{ title: 'Shuttle Run' }} />
      <Stack.Screen name="endurance-run" options={{ title: 'Endurance Run' }} />
    </Stack>
  );
}
