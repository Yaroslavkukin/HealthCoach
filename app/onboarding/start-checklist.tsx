import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { onboardingSteps } from '@/features/onboarding/onboardingSteps';
import { useI18n } from '@/i18n';
import { translatePersistenceMessage } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';
import { saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

const stepKeys: Record<string, { title: TranslationKey; description: TranslationKey }> = {
  'blood-analysis': { title: 'onboarding.step.blood.title', description: 'onboarding.step.blood.description' },
  braverman: { title: 'onboarding.step.braverman.title', description: 'onboarding.step.braverman.description' },
  lifestyle: { title: 'onboarding.step.lifestyle.title', description: 'onboarding.step.lifestyle.description' },
  nutrition: { title: 'onboarding.step.nutrition.title', description: 'onboarding.step.nutrition.description' },
  'ai-profile': { title: 'onboarding.step.ai.title', description: 'onboarding.step.ai.description' }
};

const statusKeys: Record<string, TranslationKey> = {
  'not started': 'onboarding.status.notStarted',
  'in progress': 'onboarding.status.inProgress',
  completed: 'onboarding.status.completed',
  locked: 'onboarding.status.locked'
};

export default function StartChecklistScreen() {
  const { t } = useI18n();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function continueRequiredFlow() {
    const result = await saveOnboardingChecklist({
      bloodAnalysisCompleted: false,
      bravermanCompleted: false,
      lifestyleCompleted: true,
      nutritionCompleted: false,
      aiProfileGenerated: false
    });

    setSaveMessage(translatePersistenceMessage(result.message, t));
    router.push('/onboarding/blood-upload');
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('onboarding.checklist.title')}</AppText>
      <AppText variant="body">{t('onboarding.checklist.subtitle')}</AppText>

      <StateNotice
        title={t('onboarding.checklist.title')}
        message={saveMessage ?? t('onboarding.checklist.initialSave')}
        variant="info"
      />

      {onboardingSteps.map((step, index) => {
        const locked = step.status === 'locked';

        return (
          <Pressable key={step.id} disabled={locked} onPress={() => router.push(step.route)} style={({ pressed }) => pressed && styles.pressed}>
            <SectionCard style={locked ? styles.locked : undefined}>
              <View style={styles.stepRow}>
                <View style={[styles.number, locked && styles.numberLocked]}>
                  <AppText style={styles.numberText}>{index + 1}</AppText>
                </View>
                <View style={styles.stepText}>
                  <View style={styles.titleRow}>
                    <AppText style={styles.title}>{t(stepKeys[step.id].title)}</AppText>
                    <AppText style={[styles.status, locked && styles.lockedText]}>{t(statusKeys[step.status])}</AppText>
                  </View>
                  <AppText variant="caption">{t(stepKeys[step.id].description)}</AppText>
                </View>
              </View>
            </SectionCard>
          </Pressable>
        );
      })}

      <PrimaryButton label={t('onboarding.checklist.continue')} onPress={continueRequiredFlow} />
      <PrimaryButton label={t('onboarding.checklist.preview')} variant="secondary" onPress={() => router.replace('/(tabs)/today')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center'
  },
  number: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  numberLocked: {
    backgroundColor: colors.textMuted
  },
  numberText: {
    color: colors.background,
    fontWeight: '900'
  },
  stepText: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center'
  },
  title: {
    fontWeight: '800'
  },
  status: {
    color: colors.accent,
    fontWeight: '800',
    textTransform: 'capitalize'
  },
  locked: {
    opacity: 0.62
  },
  lockedText: {
    color: colors.textMuted
  },
  pressed: {
    opacity: 0.78
  }
});
