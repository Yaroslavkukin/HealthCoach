import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { translatePersistenceMessage } from '@/i18n/mockContent';
import { generateHealthProfile } from '@/lib/aiClient';
import { saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function AIProcessingScreen() {
  const { t } = useI18n();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let routeTimer: ReturnType<typeof setTimeout> | undefined;

    async function generateProfile() {
      const result = await generateHealthProfile();

      if (!active) {
        return;
      }

      const translatedMessage = translatePersistenceMessage(result.message, t);
      setStatusMessage(translatedMessage);

      try {
        await saveOnboardingChecklist({ aiProfileGenerated: true });
      } catch {
        setStatusMessage(t('onboarding.processing.retry', { message: translatedMessage }));
      }

      routeTimer = setTimeout(() => {
        router.replace('/onboarding/ai-summary');
      }, 900);
    }

    void generateProfile();

    return () => {
      active = false;
      if (routeTimer) {
        clearTimeout(routeTimer);
      }
    };
  }, [t]);

  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.accent} size="large" />
      <AppText variant="subtitle">{t('onboarding.processing.title')}</AppText>
      <AppText variant="caption">{t('onboarding.processing.subtitle')}</AppText>
      <AppText variant="caption">{statusMessage ?? t('onboarding.processing.initial')}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 18 }
});
