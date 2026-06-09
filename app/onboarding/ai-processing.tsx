import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { generateHealthProfile } from '@/lib/aiClient';
import { saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function AIProcessingScreen() {
  const [statusMessage, setStatusMessage] = useState('Preparing a secure health profile request.');

  useEffect(() => {
    let active = true;
    let routeTimer: ReturnType<typeof setTimeout> | undefined;

    async function generateProfile() {
      const result = await generateHealthProfile();

      if (!active) {
        return;
      }

      setStatusMessage(result.message);

      try {
        await saveOnboardingChecklist({ aiProfileGenerated: true });
      } catch {
        setStatusMessage(`${result.message} Checklist sync will retry when secure persistence is available.`);
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
  }, []);

  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.accent} size="large" />
      <AppText variant="subtitle">Building your Health Profile...</AppText>
      <AppText variant="caption">Reading blood analysis, evaluating biomarkers, reviewing lifestyle, and generating recommendations.</AppText>
      <AppText variant="caption">{statusMessage}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 18 }
});
