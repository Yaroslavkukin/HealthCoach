import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider, useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <I18nProvider>
      <RootNavigator />
    </I18nProvider>
  );
}

function RootNavigator() {
  const { t } = useI18n();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '800' },
          headerBackTitle: t('common.back'),
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="preview" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ title: t('nav.subscription') }} />
        <Stack.Screen name="supplements" options={{ title: t('common.supplements') }} />
        <Stack.Screen name="bee-products" options={{ title: t('nav.beeProducts') }} />
        <Stack.Screen name="nutrition" options={{ title: t('nav.nutrition') }} />
        <Stack.Screen name="weekly-plan" options={{ title: t('nav.weeklyPlan') }} />
        <Stack.Screen name="weekly-ration" options={{ title: t('nav.weeklyRation') }} />
        <Stack.Screen name="review" options={{ title: t('nav.review') }} />
        <Stack.Screen name="subscription-expired" options={{ title: t('nav.subscriptionExpired') }} />
        <Stack.Screen name="clinic" options={{ title: t('common.clinic') }} />
        <Stack.Screen name="success-stories" options={{ title: t('nav.successStories') }} />
        <Stack.Screen name="settings" options={{ title: t('common.settings') }} />
        <Stack.Screen name="biomarker/[id]" options={{ title: t('nav.biomarker') }} />
      </Stack>
    </>
  );
}
