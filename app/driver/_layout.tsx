import { Stack } from 'expo-router';

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ title: 'Driver Dashboard' }} />
      <Stack.Screen name="login" options={{ title: 'Driver Login' }} />
      <Stack.Screen name="job/[id]" options={{ presentation: 'modal', title: 'Job Details' }} />
    </Stack>
  );
}
