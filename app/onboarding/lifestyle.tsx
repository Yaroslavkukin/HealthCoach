import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function LifestyleScreen() {
  async function saveLifestyle() {
    await saveOnboardingChecklist({ lifestyleCompleted: true });
    router.push('/onboarding/nutrition');
  }

  return (
    <ScreenContainer>
      <AppText variant="title">Lifestyle</AppText>
      <AppText variant="body">Describe your typical day, sleep, stress, work, and physical activity.</AppText>
      <SectionCard>
        {['Typical day', 'Sleep habits', 'Work schedule', 'Physical activity', 'Stress level'].map((placeholder) => (
          <TextInput key={placeholder} placeholder={placeholder} placeholderTextColor={colors.textMuted} multiline style={styles.input} />
        ))}
        <PrimaryButton label="Save Mock Lifestyle" onPress={saveLifestyle} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 72,
    backgroundColor: colors.cardElevated,
    color: colors.textPrimary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border
  }
});
