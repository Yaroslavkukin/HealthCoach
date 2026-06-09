import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { getAccessProgressLabel, getAccessStageDescription } from '@/features/access/accessModel';
import { onboardingSteps } from '@/features/onboarding/onboardingSteps';
import { saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function StartChecklistScreen() {
  const [saveMessage, setSaveMessage] = useState('Checklist is ready to sync through the Phase 3 persistence layer.');

  async function continueRequiredFlow() {
    const result = await saveOnboardingChecklist({
      bloodAnalysisCompleted: false,
      bravermanCompleted: false,
      lifestyleCompleted: true,
      nutritionCompleted: false,
      aiProfileGenerated: false
    });

    setSaveMessage(result.message);
    router.push('/onboarding/blood-upload');
  }

  return (
    <ScreenContainer>
      <AppText variant="title">Start Checklist</AppText>
      <AppText variant="body">Complete these steps to generate your personalized Health Profile.</AppText>

      <StateNotice
        title={getAccessProgressLabel('startChecklist')}
        message={`${getAccessStageDescription('startChecklist')} ${saveMessage}`}
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
                    <AppText style={styles.title}>{step.title}</AppText>
                    <AppText style={[styles.status, locked && styles.lockedText]}>{step.status}</AppText>
                  </View>
                  <AppText variant="caption">{step.description}</AppText>
                </View>
              </View>
            </SectionCard>
          </Pressable>
        );
      })}

      <PrimaryButton label="Continue Required Flow" onPress={continueRequiredFlow} />
      <PrimaryButton label="Preview Demo Dashboard" variant="secondary" onPress={() => router.replace('/(tabs)/today')} />
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
