import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { onboardingSteps, type OnboardingStepId } from '@/features/onboarding/onboardingSteps';
import { useI18n } from '@/i18n';
import { translatePersistenceMessage } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';
import {
  fetchOnboardingChecklist,
  type OnboardingChecklistState
} from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

type OnboardingStepStatus = 'not started' | 'completed' | 'locked';

const emptyChecklist: OnboardingChecklistState = {
  bloodAnalysisCompleted: false,
  bravermanCompleted: false,
  lifestyleCompleted: false,
  nutritionCompleted: false,
  aiProfileGenerated: false
};

const stepKeys: Record<OnboardingStepId, { title: TranslationKey; description: TranslationKey }> = {
  'blood-analysis': { title: 'onboarding.step.blood.title', description: 'onboarding.step.blood.description' },
  braverman: { title: 'onboarding.step.braverman.title', description: 'onboarding.step.braverman.description' },
  lifestyle: { title: 'onboarding.step.lifestyle.title', description: 'onboarding.step.lifestyle.description' },
  nutrition: { title: 'onboarding.step.nutrition.title', description: 'onboarding.step.nutrition.description' },
  'ai-profile': { title: 'onboarding.step.ai.title', description: 'onboarding.step.ai.description' }
};

const statusKeys: Record<OnboardingStepStatus, TranslationKey> = {
  'not started': 'onboarding.status.notStarted',
  completed: 'onboarding.status.completed',
  locked: 'onboarding.status.locked'
};

export default function StartChecklistScreen() {
  const { t } = useI18n();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<OnboardingChecklistState>(emptyChecklist);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      fetchOnboardingChecklist()
        .then((result) => {
          if (!isActive) {
            return;
          }

          if (result.ok) {
            setChecklist(result.data ?? emptyChecklist);
            return;
          }

          setSaveMessage(translatePersistenceMessage(result.message, t));
        })
        .catch(() => {
          if (isActive) {
            setChecklist(emptyChecklist);
          }
        });

      return () => {
        isActive = false;
      };
    }, [t])
  );

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('onboarding.checklist.title')}</AppText>
        <AppText variant="body">{t('onboarding.checklist.subtitle')}</AppText>
      </ScreenHeader>

      <StateNotice
        title={t('onboarding.checklist.title')}
        message={saveMessage ?? t('onboarding.checklist.initialSave')}
        variant="info"
      />

      {onboardingSteps.map((step, index) => {
        const status = getStepStatus(step.id, checklist);
        const locked = status === 'locked';

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
                    <AppText style={[styles.status, locked && styles.lockedText]}>{t(statusKeys[status])}</AppText>
                  </View>
                  <AppText variant="caption">{t(stepKeys[step.id].description)}</AppText>
                </View>
              </View>
            </SectionCard>
          </Pressable>
        );
      })}
    </ScreenContainer>
  );
}

function getStepStatus(stepId: OnboardingStepId, checklist: OnboardingChecklistState): OnboardingStepStatus {
  if (stepId === 'blood-analysis') {
    return checklist.bloodAnalysisCompleted ? 'completed' : 'not started';
  }

  if (stepId === 'braverman') {
    return checklist.bravermanCompleted ? 'completed' : 'not started';
  }

  if (stepId === 'lifestyle') {
    return checklist.lifestyleCompleted ? 'completed' : 'not started';
  }

  if (stepId === 'nutrition') {
    return checklist.nutritionCompleted ? 'completed' : 'not started';
  }

  if (checklist.aiProfileGenerated) {
    return 'completed';
  }

  return isRequiredDataComplete(checklist) ? 'not started' : 'locked';
}

function isRequiredDataComplete(checklist: OnboardingChecklistState) {
  return (
    checklist.bloodAnalysisCompleted &&
    checklist.bravermanCompleted &&
    checklist.lifestyleCompleted &&
    checklist.nutritionCompleted
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
    backgroundColor: colors.surfaceMuted
  },
  numberText: {
    color: colors.text,
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
    color: colors.textSoft
  },
  pressed: {
    opacity: 0.78
  }
});
