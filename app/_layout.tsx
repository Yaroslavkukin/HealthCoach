import { CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider, useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ CormorantGaramond_700Bold });

  if (!fontsLoaded) {
    return null;
  }

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
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          headerBackTitle: t('common.back'),
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="preview" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/create-account" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
        <Stack.Screen name="security" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ title: t('nav.privacyPolicy') }} />
        <Stack.Screen name="terms-of-use" options={{ title: t('nav.termsOfUse') }} />
        <Stack.Screen name="health-data-consent" options={{ title: t('nav.healthDataConsent') }} />
        <Stack.Screen name="delete-account-data" options={{ title: t('nav.deleteAccountData') }} />
        <Stack.Screen name="medical-disclaimer" options={{ title: t('nav.medicalDisclaimer') }} />
        <Stack.Screen name="bee-products" options={{ title: t('nav.beeProducts') }} />
        <Stack.Screen name="analyses" options={{ headerShown: false }} />
        <Stack.Screen name="take-analyses" options={{ headerShown: false }} />
        <Stack.Screen name="braverman-test" options={{ headerShown: false }} />
        <Stack.Screen name="braverman-test-run" options={{ headerShown: false }} />
        <Stack.Screen name="my-supplements" options={{ headerShown: false }} />
        <Stack.Screen name="supplement-catalog" options={{ headerShown: false }} />
        <Stack.Screen name="nutrition" options={{ headerShown: false }} />
        <Stack.Screen name="weekly-plan" options={{ headerShown: false }} />
        <Stack.Screen name="weekly-ration" options={{ title: t('nav.weeklyRation') }} />
        <Stack.Screen name="onboarding/start-checklist" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/profile" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/delivery" options={{ headerShown: false }} />
        <Stack.Screen name="review" options={{ title: t('nav.review') }} />
        <Stack.Screen name="subscription-expired" options={{ title: t('nav.subscriptionExpired') }} />
        <Stack.Screen name="clinic" options={{ headerShown: false }} />
        <Stack.Screen name="success-stories" options={{ title: t('nav.successStories') }} />
        <Stack.Screen name="settings" options={{ title: t('common.settings') }} />
        <Stack.Screen name="biomarker/[id]" options={{ title: t('nav.biomarker') }} />
        <Stack.Screen name="body-system/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
