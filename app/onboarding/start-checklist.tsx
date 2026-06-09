import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { onboardingSteps } from '@/features/onboarding/onboardingSteps';
import { colors } from '@/theme/colors';

export default function StartChecklistScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Start Checklist</AppText>
      <AppText variant="body">Complete these steps to generate your personalized Health Profile.</AppText>
      {onboardingSteps.map((step, index) => (
        <SectionCard key={step.id}>
          <View style={styles.stepRow}>
            <View style={styles.number}><AppText style={styles.numberText}>{index + 1}</AppText></View>
            <View style={styles.stepText}>
              <AppText style={styles.title}>{step.title}</AppText>
              <AppText variant="caption">{step.description}</AppText>
            </View>
          </View>
        </SectionCard>
      ))}
      <PrimaryButton label="Upload Blood Analysis" onPress={() => router.push('/onboarding/blood-upload')} />
      <PrimaryButton label="Skip to Demo Dashboard" variant="secondary" onPress={() => router.replace('/(tabs)/today')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stepRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  number: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: colors.background, fontWeight: '900' },
  stepText: { flex: 1 },
  title: { fontWeight: '800' }
});
