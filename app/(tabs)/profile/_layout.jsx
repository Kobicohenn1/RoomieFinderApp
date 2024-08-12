import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="editProfile"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          animationDuration: '200',
        }}
      />
    </Stack>
  );
}
