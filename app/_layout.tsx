import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="preview" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ title: 'Subscription' }} />
        <Stack.Screen name="supplements" options={{ title: 'Supplements' }} />
        <Stack.Screen name="bee-products" options={{ title: 'Bee Products' }} />
        <Stack.Screen name="nutrition" options={{ title: 'Nutrition' }} />
        <Stack.Screen name="weekly-plan" options={{ title: 'Weekly Plan' }} />
        <Stack.Screen name="review" options={{ title: '14-Day Review' }} />
        <Stack.Screen name="subscription-expired" options={{ title: 'Subscription Expired' }} />
        <Stack.Screen name="clinic" options={{ title: 'Clinic' }} />
        <Stack.Screen name="success-stories" options={{ title: 'Success Stories' }} />
        <Stack.Screen name="biomarker/[id]" options={{ title: 'Biomarker' }} />
      </Stack>
    </>
  );
}
